# POC para demostrar un PR bot

Utilizando este repositorio para aprender cómo podemos utilizar Github Actions para automatizar la creación de PRs con cambios en ramas nuevas a partir del contenido de Issues abiertos. 

La automatización debería lanzarse cada que se abre un issue válido nuevo.

Ejemplo de un issue válido:


```python
### Descripción del cambio
Se necesita actualizar el archivo config.json para agregar una nueva opción.

### BOT_ACTION
update-config
```

El bot debería crear una nueva rama, hacer los cambios necesarios en el archivo `config.json` y abrir un PR con esos cambios.

