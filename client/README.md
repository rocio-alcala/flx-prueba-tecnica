![Logo](https://flexxus.com.ar/wp-content/uploads/elementor/thumbs/logo-flexxus-header-pv8liah8khv6xfynvz03so9v98sk2tr50hts9we7dk.png)
# Prueba Técnica I+D Team - CRUD de Usuarios en React

Esta aplicación es un CRUD de usuarios creado como parte de la prueba técnica para Desarrolladores FullStack de Flexxus.


# Comentarios

## Estado global
El estado global de la aplicación está manejado por rtk-query. Considero que la complejidad de la aplicación no requiere la creación de slices personalizados para el guardado global de información, por lo que no se guardaron datos en el store y se manejaron los datos mediante estados locales.



## Filtrado de usuarios

El filtrado de usuarios y la paginación se realiza desde el lado del servidor mediante los parámetros enviados en la solicitud. Debido a que la API de `json-server` solo permite el filtrado por un parámetro, elegí realizar el filtrado únicamente por nombre de usuario.

Sin embargo, previo a la implementación de la paginación, en el [commit 560b6c7](https://github.com/rocio-alcala/flx-prueba-tecnica/commit/560b6c771b8409f9ee7f164f2ec9e1ce9ec2c6f5) se implementó el filtrado del lado del cliente realizándolo por ambos parámetros (nombre y apellido de usuario).


# API

Es importante que nuestro servidor `json-server` esté corriendo en el puerto 4000.
Para eso deberas seguir los pasos en el README de la carpeta padre de este proyecto.

# Despliegue

Puedes encontrar una versión desplegada de la aplicación [aquí](https://flx-prueba-tecnica-six.vercel.app/).

O correrla localmente mediante

```bash
cd ../client
npm install
npm run dev
```





