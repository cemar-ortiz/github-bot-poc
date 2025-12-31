# POC para demostrar un PR bot

Utilizando este repositorio para aprender cómo podemos utilizar Github Actions para automatizar la creación de PRs con cambios en ramas nuevas a partir del contenido de Issues abiertos. Especificamente, nos interesa que este bot pueda abrir un PR para actualizar el archivo Pipfile en el repositorio cuando se abra un issue con una solicitud de actualización para cambiar la versión de alguna dependencia.

La automatización debería lanzarse cada que se abre un issue válido nuevo.

Ejemplo de un issue válido:


```python
### Descripción del cambio
Se necesita actualizar el archivo Pipfile para actualizar una dependencia.

### BOT_ACTION
update-pipfile: 
  package: pandas
  version: 1.5.3
```

El bot debería crear una nueva rama, hacer los cambios necesarios en el archivo `Pipfile` y abrir un PR con esos cambios.

