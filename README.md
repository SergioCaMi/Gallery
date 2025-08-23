
# Table of Contents

## English
1. [Project Name](#project-name)
2. [Description](#description)
3. [Badges & Project Status](#badges--project-status)
4. [Technologies & Tools](#technologies--tools)
5. [Installation](#installation)
6. [Usage](#usage)
7. [Features](#features)
8. [Project Structure](#project-structure)
9. [Testing](#testing)
10. [Deployment / Hosting](#deployment--hosting)
11. [License](#license)
12. [Author & Contact](#author--contact)
13. [Acknowledgements & Resources](#acknowledgements--resources)
14. [Roadmap / Notes](#roadmap--notes)
15. [What I Learned](#what-i-learned)

## Español
1. [Nombre del Proyecto](#nombre-del-proyecto)
2. [Descripción](#descripción)
3. [Badges y Estado del Proyecto](#badges-y-estado-del-proyecto)
4. [Tecnologías y Herramientas](#tecnologías-y-herramientas)
5. [Instalación](#instalación)
6. [Uso](#uso)
7. [Funcionalidades](#funcionalidades)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [Testing](#testing)
10. [Despliegue / Hosting](#despliegue--hosting)
11. [Licencia](#licencia)
12. [Autor / Contacto](#autor--contacto)
13. [Agradecimientos / Recursos](#agradecimientos--recursos)
14. [Notas / Roadmap](#notas--roadmap)
15. [Lo que he aprendido](#lo-que-he-aprendido)

---

# Project Name
**Gallery** ![Project Status](https://img.shields.io/badge/status-active-brightgreen) ![Version](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-ISC-lightgrey)

---

## Description
Gallery is a web application built with Node.js and Express that allows DUMMY users to view, add, and edit images in a gallery. Its goal is to provide easy image management, integrating authentication and MongoDB storage. It solves the need to organize images simply and securely.

---

## Badges & Project Status
- ![Version](https://img.shields.io/badge/version-1.0.0-blue)
- ![Status](https://img.shields.io/badge/status-active-brightgreen)
- ![License](https://img.shields.io/badge/license-ISC-lightgrey)
- ![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-success)

---

## Technologies & Tools
- ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) Node.js
- ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) Express
- ![EJS](https://img.shields.io/badge/EJS-ffc300?logo=ejs&logoColor=black) EJS
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) Mongoose
- ![Passport](https://img.shields.io/badge/Passport-34A853?logo=passport&logoColor=white) Passport
- dotenv, morgan, uuid, node-fetch, connect-mongo, get-image-colors, exifr

---

## Installation
1. Clone the repository:
   ```powershell
   git clone https://github.com/SergioCaMi/Gallery.git
   cd Gallery
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Set up the `.env` file (use `.env.example` as a reference).

---

## Usage

### DUMMY User Mode

The application supports two authentication modes controlled by the environment variable `USE_DUMMY_AUTH`:

- **DUMMY Mode (`USE_DUMMY_AUTH=true`)**
   - No real authentication is required.
   - A simulated user called "DUMMY User" is automatically logged in.
   - Ideal for development, testing, and demos.
   - Sample images are loaded for demonstration.
   - No real database is required; data is stored in memory and lost on restart.

- **Production Mode (`USE_DUMMY_AUTH=false`)**
   - Real authentication via Google OAuth is required.
   - Users must log in with their Google account.
   - Images and user data are stored persistently in MongoDB.
   - Suitable for real deployments and production use.

#### How to switch modes

Set the variable in your `.env` file:

```env
USE_DUMMY_AUTH=true   # Enables DUMMY mode (default for development)
USE_DUMMY_AUTH=false  # Enables real authentication (production)
```

#### Usage Steps

1. Start the app in development mode:
    ```powershell
    npm run dev
    ```
2. Go to `http://localhost:3000` in your browser.
3. If DUMMY mode is enabled, you will be automatically logged in as the DUMMY user and see sample images. If not, you will be prompted to log in with Google.
4. You can view, add, and edit images according to the selected mode.

---

## Features
- View image gallery
- Add new images
- Edit existing images
- Authentication with Passport and Google OAuth
- MongoDB storage
- Friendly interface with EJS

---

## Project Structure
```
Gallery/
│
├── auth.js
├── index.js
├── migrate.js
├── package.json
├── data/
│   └── dummy-images.json
├── models/
│   └── image.model.js
├── public/
│   └── style.css
├── routes/
│   └── imageRoutes.js
├── views/
│   ├── addImage.ejs
│   ├── editImage.ejs
│   ├── home.ejs
│   ├── page404.ejs
│   ├── viewImage.ejs
│   ├── welcome.ejs
│   └── template/
│       ├── cabecera.ejs
│       ├── footer.ejs
│       └── imageCard.ejs
```

---

## Testing
Currently, the project does not include automated tests.

---

## Deployment / Hosting
No public deployment available at the moment.

---

## License
This project is licensed under the ISC license.  
![License](https://img.shields.io/badge/license-ISC-lightgrey)

---

## Author & Contact
- **Sergio CaMi**
- [GitHub](https://github.com/SergioCaMi)
- Email: *(add your email if desired)*
- LinkedIn: *(add your LinkedIn if desired)*

---

## Acknowledgements & Resources
- [Express](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [MongoDB](https://www.mongodb.com/)
- [Passport.js](http://www.passportjs.org/)
- Official Node.js and Express documentation

---

## Roadmap / Notes
- Improve user management
- Add automated tests
- Deploy to a cloud platform
- Enhance user interface

---

## What I Learned
- Integrating Node.js with Express and MongoDB
- Implementing authentication with Passport and Google OAuth
- Using EJS for dynamic views
- Best practices in Node.js project structure
- Solving dependency and configuration issues
- Soft skills: organization, documentation, and autonomous work

---

# Nombre del Proyecto
**Gallery** ![Estado del Proyecto](https://img.shields.io/badge/status-activo-brightgreen) ![Versión](https://img.shields.io/badge/version-1.0.0-blue) ![Licencia](https://img.shields.io/badge/license-ISC-lightgrey)

---

## Descripción
Gallery es una aplicación web desarrollada con Node.js y Express que permite a los usuarios DUMMY visualizar, añadir y editar imágenes en una galería. El objetivo es facilitar la gestión visual de imágenes, integrando autenticación y almacenamiento en MongoDB. Resuelve la necesidad de organizar imágenes de forma sencilla y segura.

---

## Badges y Estado del Proyecto
- ![Versión](https://img.shields.io/badge/version-1.0.0-blue)
- ![Estado](https://img.shields.io/badge/status-activo-brightgreen)
- ![Licencia](https://img.shields.io/badge/license-ISC-lightgrey)
- ![Dependencias](https://img.shields.io/badge/dependencies-actualizadas-success)

---

## Tecnologías y Herramientas
- ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white) Node.js
- ![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white) Express
- ![EJS](https://img.shields.io/badge/EJS-ffc300?logo=ejs&logoColor=black) EJS
- ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) Mongoose
- ![Passport](https://img.shields.io/badge/Passport-34A853?logo=passport&logoColor=white) Passport
- dotenv, morgan, uuid, node-fetch, connect-mongo, get-image-colors, exifr

---

## Instalación
1. Clona el repositorio:
   ```powershell
   git clone https://github.com/SergioCaMi/Gallery.git
   cd Gallery
   ```
2. Instala las dependencias:
   ```powershell
   npm install
   ```
3. Configura el archivo `.env` (puedes usar `.env.example` como referencia).

---

## Uso

### Modo Usuario DUMMY

La aplicación soporta dos modos de autenticación, controlados por la variable de entorno `USE_DUMMY_AUTH`:

- **Modo DUMMY (`USE_DUMMY_AUTH=true`)**
   - No se requiere autenticación real.
   - Se inicia sesión automáticamente como "Usuario DUMMY".
   - Ideal para desarrollo, pruebas y demostraciones.
   - Se cargan imágenes de ejemplo para mostrar la funcionalidad.
   - No se necesita base de datos real; los datos se guardan en memoria y se pierden al reiniciar.

- **Modo Producción (`USE_DUMMY_AUTH=false`)**
   - Requiere autenticación real mediante Google OAuth.
   - Los usuarios deben iniciar sesión con su cuenta de Google.
   - Las imágenes y datos de usuario se almacenan de forma persistente en MongoDB.
   - Recomendado para despliegues reales y uso en producción.

#### ¿Cómo cambiar entre modos?

Configura la variable en tu archivo `.env`:

```env
USE_DUMMY_AUTH=true   # Activa el modo DUMMY (por defecto en desarrollo)
USE_DUMMY_AUTH=false  # Activa la autenticación real (producción)
```

#### Pasos de uso

1. Inicia la aplicación en modo desarrollo:
    ```powershell
    npm run dev
    ```
2. Accede a `http://localhost:3000` en tu navegador.
3. Si el modo DUMMY está activado, entrarás automáticamente como usuario DUMMY y verás imágenes de ejemplo. Si no, se te pedirá iniciar sesión con Google.
4. Podrás visualizar, añadir y editar imágenes según el modo seleccionado.

---

## Funcionalidades
- Visualización de galería de imágenes
- Añadir nuevas imágenes
- Editar imágenes existentes
- Autenticación con Passport y Google OAuth
- Almacenamiento en MongoDB
- Interfaz amigable con EJS

---

## Estructura del Proyecto
```
Gallery/
│
├── auth.js
├── index.js
├── migrate.js
├── package.json
├── data/
│   └── dummy-images.json
├── models/
│   └── image.model.js
├── public/
│   └── style.css
├── routes/
│   └── imageRoutes.js
├── views/
│   ├── addImage.ejs
│   ├── editImage.ejs
│   ├── home.ejs
│   ├── page404.ejs
│   ├── viewImage.ejs
│   ├── welcome.ejs
│   └── template/
│       ├── cabecera.ejs
│       ├── footer.ejs
│       └── imageCard.ejs
```

---

## Testing
Actualmente, el proyecto no incluye tests automatizados.

---

## Despliegue / Hosting
No hay despliegue público disponible actualmente.

---

## Licencia
Este proyecto está bajo la licencia ISC.  
![Licencia](https://img.shields.io/badge/license-ISC-lightgrey)

---

## Autor / Contacto
- **Sergio CaMi**
- [GitHub](https://github.com/SergioCaMi)
- Email: *(añade tu email si lo deseas)*
- LinkedIn: *(añade tu LinkedIn si lo deseas)*

---

## Agradecimientos / Recursos
- [Express](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [MongoDB](https://www.mongodb.com/)
- [Passport.js](http://www.passportjs.org/)
- Tutoriales y documentación oficial de Node.js y Express

---

## Notas / Roadmap
- Mejorar la gestión de usuarios
- Añadir tests automatizados
- Implementar despliegue en plataforma cloud
- Mejorar la interfaz de usuario

---

## Lo que he aprendido
- Integración de Node.js con Express y MongoDB
- Implementación de autenticación con Passport y Google OAuth
- Uso de EJS para vistas dinámicas
- Buenas prácticas en la estructura de proyectos Node.js
- Resolución de problemas de dependencias y configuración
- Habilidades blandas: organización, documentación y trabajo autónomo
