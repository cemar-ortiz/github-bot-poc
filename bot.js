const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const { execSync } = require('child_process');

const token = process.env.GITHUB_TOKEN;
const octokit = github.getOctokit(token);
const context = github.context;

(async () => {
  const issue = context.payload.issue;
  const body = issue.body || '';

  if (!body.includes('BOT_ACTION')) {
    console.log('No BOT_ACTION found. Exiting.');
    return;
  }

  const repo = context.repo;
  const branchName = `bot/issue-${issue.number}`;

  // 1️⃣ Crear rama
  execSync(`git checkout -b ${branchName}`);

  // 2️⃣ Cambio de ejemplo
  const file = 'bot-change.txt';
  fs.writeFileSync(
    file,
    `Cambio generado desde Issue #${issue.number}\n`
  );

  execSync(`git add ${file}`);
  execSync(`git commit -m "Bot: cambio automático por Issue #${issue.number}"`);
  execSync(`git push origin ${branchName}`);

  // 3️⃣ Crear PR
  await octokit.rest.pulls.create({
    owner: repo.owner,
    repo: repo.repo,
    title: `Bot PR para Issue #${issue.number}`,
    head: branchName,
    base: 'main',
    body: `Este PR fue generado automáticamente para resolver el Issue #${issue.number}`
  });

  console.log('PR creado exitosamente 🎉');
})();
