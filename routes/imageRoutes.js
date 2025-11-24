const express = require("express");
const router = express.Router();
const Image = require("../models/image.model");
const getColors = require("get-image-colors");
const fetch = require("node-fetch");
const exifr = require("exifr");
const fs = require("fs");
const path = require("path");

// ********** Archivo temporal para persistir datos dummy **********
const dummyDataFile = path.join(__dirname, '../data/dummy-images.json');

// ********** Datos iniciales para modo dummy (si no existe archivo) **********
const initialDummyData = [
  {
    "_id": "dummy1754726998173",
    "id": "dummy1754726998173",
    "title": "Imagen de Ejemplo",
    "urlImagen": "https://c.files.bbci.co.uk/14241/production/_111879428_pilares.jpg",
    "url": "https://c.files.bbci.co.uk/14241/production/_111879428_pilares.jpg",
    "date": new Date().toISOString(),
    "description": "Esta es una imagen de ejemplo para el modo demo",
    "colors": [
      { "_rgb": [72, 84, 101, 1] },
      { "_rgb": [196, 177, 148, 1] }
    ],
    "exif": {
      "XResolution": 96,
      "YResolution": 96,
      "ResolutionUnit": "inches"
    },
    "user": {
      "name": "Usuario de Prueba",
      "email": "dummy@test.com"
    }
  }
];

// ********** Función para cargar datos dummy desde archivo **********
function loadDummyImages() {
  // Solo cargar en modo dummy
  if (process.env.USE_DUMMY_AUTH !== 'true') {
    return [];
  }
  
  try {
    if (fs.existsSync(dummyDataFile)) {
      const data = fs.readFileSync(dummyDataFile, 'utf8');
      return JSON.parse(data);
    } else {
      // Si no existe, crear con datos iniciales
      console.log('📝 Creando nuevo archivo de datos dummy con imagen de ejemplo...');
      saveDummyImages(initialDummyData);
      return initialDummyData;
    }
  } catch (error) {
    console.log('⚠️  Error al cargar datos dummy:', error.message);
    return initialDummyData;
  }
}

// ********** Función para guardar datos dummy en archivo **********
function saveDummyImages(images) {
  // Solo guardar en modo dummy
  if (process.env.USE_DUMMY_AUTH !== 'true') {
    return;
  }
  
  try {
    // Crear directorio si no existe
    const dataDir = path.dirname(dummyDataFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dummyDataFile, JSON.stringify(images, null, 2));
  } catch (error) {
    console.error('Error guardando datos dummy:', error);
  }
}

// ********** Datos de ejemplo para modo dummy **********
let dummyImages = loadDummyImages();

// ********** Función auxiliar para operaciones de base de datos **********
async function getImages() {
  if (process.env.USE_DUMMY_AUTH === 'true') {
    // En modo dummy, devolver imágenes de ejemplo
    return dummyImages;
  } else {
    // En modo real, consultar base de datos
    return await Image.find({}).sort({ date: 1 });
  }
}

async function getImageById(id) {
  if (process.env.USE_DUMMY_AUTH === 'true') {
    return dummyImages.find(img => img._id === id || img.id === id) || null;
  } else {
    return await Image.findById(id);
  }
}

async function findImageByUrl(url) {
  if (process.env.USE_DUMMY_AUTH === 'true') {
    // En modo dummy, también verificar duplicados por URL
    return dummyImages.find(img => img.url === url || img.urlImagen === url) || null;
  } else {
    return await Image.findOne({ urlImagen: url });
  }
}

async function saveImage(imageData) {
  if (process.env.USE_DUMMY_AUTH === 'true') {
    // En modo dummy, simular guardado
    const id = 'dummy' + Date.now();
    const newImage = {
      _id: id,
      id: id, // Compatible con vistas EJS
      ...imageData,
      date: new Date()
    };
    dummyImages.push(newImage);
    
    // Persistir en archivo JSON
    saveDummyImages(dummyImages);
    
    return newImage;
  } else {
    const newImage = new Image(imageData);
    return await newImage.save();
  }
}

async function deleteImageById(id) {
  if (process.env.USE_DUMMY_AUTH === 'true') {
    const index = dummyImages.findIndex(img => img._id === id || img.id === id);
    if (index > -1) {
      dummyImages.splice(index, 1);
      
      // Persistir cambios en archivo JSON
      saveDummyImages(dummyImages);
      
      return true;
    }
    return false;
  } else {
    await Image.findByIdAndDelete(id);
    return true;
  }
}

async function updateImageById(id, updateData) {
  if (process.env.USE_DUMMY_AUTH === 'true') {
    const imageIndex = dummyImages.findIndex(img => img._id === id || img.id === id);
    if (imageIndex > -1) {
      dummyImages[imageIndex] = { ...dummyImages[imageIndex], ...updateData };
      
      // Persistir cambios en archivo JSON
      saveDummyImages(dummyImages);
      
      return dummyImages[imageIndex];
    }
    return null;
  } else {
    return await Image.findByIdAndUpdate(id, updateData, { new: true });
  }
}

// Función para extraer EXIF
async function extractExifFromUrl(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Error al descargar imagen");
    const buffer = await response.buffer();
    return await exifr.parse(buffer);
  } catch (error) {
    console.error("Error al extraer EXIF:", error);
    return null;
  }
}

// ********** Función para comprobar si los usuarios han hecho login **********
function isAuthenticated(req, res, next) {
  // En modo dummy, verificar múltiples formas de autenticación
  if (process.env.USE_DUMMY_AUTH === 'true') {
    // Verificar si existe usuario dummy en sesión directa
    if (req.session.dummyUser) {
      req.user = req.session.dummyUser;
      return next();
    }
    
    // Verificar si existe usuario dummy en sesión de passport
    if (req.session.passport && req.session.passport.user) {
      req.user = req.session.passport.user;
      return next();
    }
  }
  
  // En modo real, verificar autenticación normal de passport
  if (req.isAuthenticated()) return next();
  
  res.redirect("/");
}

// ********** Función para renderizar con todos los datos necesarios **********
function getRenderObject(
  title,
  dataImage = null,
  req = null,
  message = undefined,
  colorMessage = "black",
  user = null
) {
  let userData = user;
  
  if (!userData && req) {
    // En modo dummy, verificar usuario dummy
    if (process.env.USE_DUMMY_AUTH === 'true') {
      if (req.session.dummyUser) {
        userData = { photo: req.session.dummyUser.photos[0].value };
      } else if (req.session.passport && req.session.passport.user) {
        userData = { photo: req.session.passport.user.photos[0].value };
      }
    } else {
      // En modo real, verificar autenticación normal
      if (req.isAuthenticated?.() && req.user && req.user.photos && req.user.photos.length > 0) {
        userData = { photo: req.user.photos[0].value };
      }
    }
  }

  return {
    title,
    dataImage,
    message,
    colorMessage,
    user: userData,
  };
}
// **************************************** Home ****************************************
router.get("/", async (req, res) => {
  try {
    // ******************** Buscamos todas las imagenes ********************
    const dataImage = await getImages();
    
    console.log('🔍 DEBUG HOME:');
    console.log('Modo:', process.env.USE_DUMMY_AUTH === 'true' ? 'DUMMY' : 'PRODUCCIÓN');
    console.log('Total imágenes:', dataImage.length);
    if (dataImage.length > 0) {
      console.log('Primera imagen:', {
        id: dataImage[0]._id || dataImage[0].id,
        title: dataImage[0].title,
        hasUrl: !!dataImage[0].urlImagen
      });
    }
    
    const renderData = getRenderObject(
      "Home",
      dataImage,
      req,
      undefined,
      "black"
    );
    res.status(200).render("home.ejs", renderData);
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// **************************************** Add new image ****************************************
// **************************************** Add new image GET (Mostrar formulario) ****************************************

router.get("/new-image", isAuthenticated, async (req, res) => {
  try {
    const dataImage = await getImages();
    const renderData = getRenderObject("New Image", dataImage, req);
    res.status(200).render("addImage.ejs", renderData);
  } catch (error) {
    console.error("Error al cargar formulario:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// **************************************** Add new image POST (guardar imagen) ****************************************
router.post("/new-image", isAuthenticated, async (req, res) => {
  try {
    const dataImage = await getImages();
    
    console.log('🔍 Debug: Verificando URL duplicada:', req.body.urlImagen);
    console.log('🔍 Debug: Modo actual:', process.env.USE_DUMMY_AUTH === 'true' ? 'DUMMY' : 'PRODUCCIÓN');
    
    const existingImage = await findImageByUrl(req.body.urlImagen);
    
    if (existingImage) {
      console.log('❌ Debug: ¡DUPLICADO ENCONTRADO!', existingImage.title || existingImage._id);
      const renderData = getRenderObject(
        "New Image",
        dataImage,
        req,
        `La imagen "${req.body.title}" ya se encontraba en el archivo.`,
        "red"
      );
      return res.status(400).render("addImage.ejs", renderData);
    }
    
    console.log('✅ Debug: URL nueva, procediendo a crear imagen...');

    let colors;
    try {
      colors = await getColors(req.body.urlImagen);
    } catch (error) {
      console.error("Error al obtener colores:", error);
      colors = null;
    }

    const exifData = await extractExifFromUrl(req.body.urlImagen);

    // Preparar datos de la imagen
    const imageData = {
      title: req.body.title,
      urlImagen: req.body.urlImagen,
      url: req.body.urlImagen, // Para compatibilidad con datos dummy
      date: req.body.date,
      description: req.body.description,
      colors,
      exif: exifData,
      user: {
        name: req.user.displayName || `${req.user.name?.givenName || ''} ${req.user.name?.familyName || ''}`.trim(),
        email: req.user.emails?.[0]?.value || req.user.email || "dummy@test.com",
      },
    };

    try {
      await saveImage(imageData);
      const updatedDataImage = await getImages();
      const renderData = getRenderObject(
        "New Image",
        updatedDataImage,
        req,
        `La imagen "${req.body.title}" se ha añadido satisfactoriamente.`,
        "green"
      );
      res.status(201).render("addImage.ejs", renderData);
    } catch (err) {
      console.error("Error al guardar imagen:", err);
      res.status(500).render("Page404.ejs", { 
        message: err.message, 
        status: 500,
        user: req.user 
      });
      return;
    }
  } catch (error) {
    console.error("Error al añadir imagen:", error);
    res.status(500).render("Page404.ejs", { message: "Error al añadir la imagen", status: 500,
    user: req.user });
  }
});

// **************************************** Eliminar imagen ****************************************
router.post("/image/:id/delete", isAuthenticated, async (req, res) => {
  try {
    const deleted = await deleteImageById(req.params.id);
    if (!deleted) {
      return res.status(404).render("Page404.ejs", { 
        message: "Imagen no encontrada", 
        status: 404,
        user: req.user
      });
    }
    
    const dataImage = await getImages();
    const renderData = getRenderObject(
      "Home",
      dataImage,
      req,
      `La imagen se ha eliminado satisfactoriamente.`,
      "green"
    );
    return res.status(200).render("home.ejs", renderData);
  } catch (error) {
    console.error(`Error al eliminar imagen con id ${req.params.id}:`, error);
    res.status(500).render("Page404.ejs", { 
      message: "Error al eliminar la imagen", 
      status: 500,
      user: req.user
    });
  }
});

// **************************************** Visualizar  ****************************************

router.get("/image/:id/view", async (req, res) => {
  try {
    const image = await getImageById(req.params.id);

    if (!image) {
     return res.status(404).render("Page404.ejs", { 
       message: "Imagen no encontrada", 
       status: 404,
       user: req.user
     });
    }

    const renderData = getRenderObject("View", [image], req);

    return res.status(200).render("viewImage.ejs", renderData);
  } catch (error) {
    console.error("Error al ver imagen:", error);
    res.status(500).render("Page404.ejs", { 
      message: "Error al cargar imagen", 
      status: 500,
      user: req.user
    });
  }
});
// **************************************** Editar  ****************************************
// **************************************** Editar  GET (cargar datos antiguos) ****************************************

router.get("/image/:id/edit", isAuthenticated, async (req, res) => {
  try {
    const image = await getImageById(req.params.id);
    if (!image) {
     return res.status(404).render("Page404.ejs", { 
       message: "Imagen no encontrada", 
       status: 404,
       user: req.user
     });
    }
    const renderData = getRenderObject("Edit", [image], req);
    console.log("Datos de la imagen a editar:", renderData);
    return res.status(200).render("editImage.ejs", renderData);
  } catch (error) {
    console.error("Error al editar imagen:", error);
    res.status(500).render("Page404.ejs", { 
      message: "Error al editar imagen", 
      status: 500,
      user: req.user 
    });
  }
});

// **************************************** Editar POST (guardar nuevos datos) ****************************************

router.post("/edit-image", isAuthenticated, async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      date: req.body.date,
      description: req.body.description,
    };
    
    const updatedImage = await updateImageById(req.body.id, updateData);
    if (!updatedImage) {
      return res.status(404).render("Page404.ejs", { 
        message: "Imagen no encontrada", 
        status: 404,
        user: req.user
      });
    }

    res.redirect("/");
  } catch (error) {
    console.error("Error al actualizar imagen:", error);
    res.status(500).render("Page404.ejs", { 
      message: "Error al actualizar imagen", 
      status: 500,
      user: req.user
    });
  }
});

// **************************************** Descargar imagen ****************************************
router.get("/image/:id/download", async (req, res) => {
  try {
    const image = await getImageById(req.params.id);
    if (!image) {
      return res.status(404).render("Page404.ejs", { 
        message: "Imagen no encontrada", 
        status: 404,
        user: req.user
      });
    }

    // En modo dummy, simular descarga
    if (process.env.USE_DUMMY_AUTH === 'true') {
      // Mensaje informativo sobre descarga en modo demo
      const message = `✅ Función de descarga funcional!<br><br>
        <strong>Imagen:</strong> ${image.title}<br>
        <strong>URL:</strong> ${image.urlImagen || image.url}<br><br>
        <em>En modo demo las imágenes son URLs externas simuladas.<br>
        La descarga real funcionaría con imágenes almacenadas localmente.</em>`;
      
      return res.status(200).render("Page404.ejs", { 
        message, 
        status: 200,
        user: req.user
      });
    }

    // Usar la URL correcta según el modo
    const imageUrl = image.urlImagen || image.url;
    
    const response = await fetch(imageUrl);
    if (response.ok) {
      const buffer = await response.buffer();
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="image-${Date.now()}.jpg"`
      );
      res.setHeader("Content-Type", "image/jpeg");
      res.send(buffer);
    } else {
      throw new Error("No se pudo descargar la imagen remota");
    }
  } catch (error) {
    console.error("Error al descargar imagen:", error);
    res.status(500).render("Page404.ejs", { 
      message: "No se pudo descargar la imagen.", 
      status: 500,
      user: req.user
    });
  }
});

module.exports = router;
