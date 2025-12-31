const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const { execSync } = require('child_process');
const yaml = require('js-yaml');


const token = process.env.GITHUB_TOKEN;
const octokit = github.getOctokit(token);
const context = github.context;


function extractBotAction(issueBody) {
  const match = issueBody.match(/### BOT_ACTION([\s\S]*)$/);
  if (!match) return null;

  try {
    return yaml.load(match[1]);
  } catch (e) {
    throw new Error('BOT_ACTION inválido (YAML mal formado)');
  }
}


function updatePipfileDependency(packageName, version) {
  const pipfilePath = 'Pipfile';

  if (!fs.existsSync(pipfilePath)) {
    throw new Error('Pipfile no encontrado');
  }

  let content = fs.readFileSync(pipfilePath, 'utf8');

  const regex = new RegExp(
    `^${packageName}\\s*=.*$`,
    'm'
  );

  if (!regex.test(content)) {
    throw new Error(`Paquete ${packageName} no encontrado en Pipfile`);
  }

  content = content.replace(
    regex,
    `${packageName} = "==${version}"`
  );

  fs.writeFileSync(pipfilePath, content);
}

(async () => {
  const issue = context.payload.issue;
  const body = issue.body || '';

  if (!body.includes('BOT_ACTION')) {
    console.log('No BOT_ACTION found. Exiting.');
    return;
  }

  const repo = context.repo;
  const branchName = `bot/issue-${issue.number}`;

  execSync(`git checkout -b ${branchName}`);

  const action = extractBotAction(body);

  if (!action || !action['update-pipfile']) {
    console.log('No update-pipfile action found');
    return;
  }

  const { package, version } = action['update-pipfile'];

  console.log(`Actualizando ${package} a versión ${version}`);
  updatePipfileDependency(package, version);

  execSync(`git add Pipfile`);
  execSync(`git commit -m "Bot: update ${package} to ${version} (Issue #${issue.number})"`);
  execSync(`git push origin ${branchName}`);

  // 3️⃣ Crear PR
  await octokit.rest.pulls.create({
    owner: repo.owner,
    repo: repo.repo,
    title: `Update ${package} to ${version}`,
    head: branchName,
    base: 'main',
    body: `PR automático para Issue #${issue.number}`
  });

  console.log('PR creado exitosamente');
})();
