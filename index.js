// ****************************** Server ******************************
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");
const fs = require("fs");

// ****************************** Sesión Google + Autenticación ******************************

// ********** Cargar las variables de entorno **********
require("dotenv").config();

// Debug inicial: verificar carga de variables de entorno
console.log('🔧 Iniciando aplicación...');
console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
console.log('🔍 USE_DUMMY_AUTH:', process.env.USE_DUMMY_AUTH);

// Limpiar archivo dummy si estamos en modo producción
const dummyFilePath = path.join(__dirname, 'data', 'dummy-images.json');
if (process.env.USE_DUMMY_AUTH === 'false') {
  if (fs.existsSync(dummyFilePath)) {
    console.log('🗑️  Modo producción detectado: eliminando archivo dummy...');
    try {
      fs.unlinkSync(dummyFilePath);
      console.log('✅ Archivo dummy eliminado correctamente');
    } catch (error) {
      console.error('⚠️  Error al eliminar archivo dummy:', error.message);
    }
  }
}

// Verificar si estamos en Render
if (process.env.RENDER) {
  console.log('🌐 Detectado entorno Render');
  
  // En Render, asegurar que las variables críticas están definidas
  if (process.env.USE_DUMMY_AUTH === 'false') {
    console.log('🔧 Modo producción en Render - Verificando variables...');
    
    // Lista de todas las variables de entorno de Render
    console.log('📋 Todas las variables de entorno disponibles:');
    Object.keys(process.env).forEach(key => {
      if (key.includes('MONGO') || key.includes('GOOGLE') || key.includes('USE_DUMMY') || key.includes('SESSION')) {
        console.log(`  ${key}: ${key.includes('SECRET') || key.includes('PASSWORD') ? '[OCULTO]' : process.env[key]}`);
      }
    });
  }
}

// ********** Configura la sesión del usuario **********
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
require("./auth");

// ********** Configura una sesión segura para cada usuario **********
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // En producción con HTTPS, cambiar a true
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
};

// En producción, usar MongoDB para almacenar sesiones
const mongoUriForSessions = process.env.MONGO_URI || process.env.MONGODB_URI;
if (process.env.USE_DUMMY_AUTH === 'false' && mongoUriForSessions) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: mongoUriForSessions,
    touchAfter: 24 * 3600 // lazy session update
  });
  console.log('🗄️ Configurando sesiones con MongoDB Store');
} else {
  console.log('⚠️ Usando MemoryStore para sesiones (solo desarrollo)');
}

app.use(session(sessionConfig));

// ********** Iniciar Passport y lo conecta con las sesiones de Express **********
app.use(passport.initialize());
app.use(passport.session());

// ********** Rutas de autenticación (dummy o real según configuración) **********
if (process.env.USE_DUMMY_AUTH === 'true') {
  // Modo dummy: simular autenticación sin Google OAuth
  app.get("/auth/google", (req, res) => {
    // Simular usuario logueado
    req.session.dummyUser = {
      id: 'dummy_user_123',
      displayName: 'Usuario de Prueba',
      emails: [{ value: 'dummy@test.com' }],
      photos: [{ value: 'https://via.placeholder.com/50x50/4285f4/fff?text=Demo' }]
    };
    res.redirect('/google/callback');
  });

  app.get("/google/callback", (req, res) => {
    // En modo dummy, verificar que existe usuario dummy
    if (!req.session.dummyUser) {
      // Si no existe usuario dummy, redirigir a auth
      return res.redirect('/auth/google');
    }
    
    // En modo dummy, simular el comportamiento de passport
    req.user = req.session.dummyUser;
    
    // Simular la serialización de passport para mantener la sesión
    req.session.passport = { user: req.session.dummyUser };
    
    res.render("welcome", { user: req.user });
  });

} else {
  // Modo real: usar Google OAuth
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  app.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
      res.render("welcome", { user: req.user });
    }
  );
}

// ********** Cerrar sesión **********
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).render("Page404.ejs", { message: "Error al cerrar sesión", status: 500 ,
    user: req.user});
    res.redirect("/");
  });
});

// ****************************** Conexión a MongoDB + mongoose ******************************

// ********** Conexión a la base de datos **********
const mongoose = require("mongoose");
const Image = require("./models/image.model");

async function main() {
  // Debug: Verificar variables de entorno en producción
  console.log('🔍 Debug Variables de Entorno:');
  console.log('USE_DUMMY_AUTH:', process.env.USE_DUMMY_AUTH);
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'CONFIGURADO' : 'NO CONFIGURADO');
  console.log('MONGO_URI:', process.env.MONGO_URI ? 'CONFIGURADO' : 'NO CONFIGURADO');
  console.log('MONGODB_URI valor:', process.env.MONGODB_URI);
  console.log('MONGO_URI valor:', process.env.MONGO_URI);
  
  // Configuración de MongoDB con fallback para modo demo
  // IMPORTANTE: Render usa MONGO_URI, no MONGODB_URI
  let mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  // CRÍTICO: Si no hay URI en producción, usar Atlas directamente
  if (!mongoUri && process.env.USE_DUMMY_AUTH === 'false') {
    console.log('⚠️ MONGO_URI no encontrado. Usando Atlas directamente...');
    mongoUri = 'mongodb+srv://sergiocami84:Msg--300183@cluster0.mo4mc0w.mongodb.net/gallery';
  } else if (!mongoUri) {
    mongoUri = 'mongodb://localhost:27017/fototeca_demo';
  }
  
  console.log('🔗 URI final a usar:', mongoUri);

  if (process.env.USE_DUMMY_AUTH === 'true') {
    console.log('� Modo demo: Intentando conectar a MongoDB (opcional)...');
    try {
      await mongoose.connect(mongoUri, { 
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000 
      });
      console.log('✅ Conectado a MongoDB exitosamente');
    } catch (error) {
      console.log('⚠️ MongoDB no disponible. Continuando en modo demo sin persistencia...');
      // En modo demo, continúa sin base de datos
    }
  } else {
    console.log('📊 Modo producción: Conectando a MongoDB...');
    try {
      // Configuración específica para Render
      const connectOptions = {
        serverSelectionTimeoutMS: 30000, // 30 segundos
        connectTimeoutMS: 30000,
        family: 4 // Forzar IPv4
      };
      
      await mongoose.connect(mongoUri, connectOptions);
      console.log('✅ Conectado a MongoDB exitosamente');
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error.message);
      console.error('❌ Stack completo:', error);
      process.exit(1);
    }
  }

  // ********** Morgan para visualizar el flujo por consola **********
  const morgan = require("morgan");
  app.use(morgan("dev"));

  // ********** Procesar datos de formularios y JSON **********
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ********** Motor de vistas EJS **********
  app.set("view engine", "ejs");
  app.use(express.static("public"));

  // ********** Rutas modularizadas **********
  const imageRoutes = require("./routes/imageRoutes");
  app.use(imageRoutes);

  // ******************** URL inválida Error 404 ********************
  app.use((req, res) => {
    res.status(404).render("Page404.ejs", { message: "Página no encontrada", status: 404 ,
    user: req.user});
  });

  // ******************** Errores ********************
  const dirPath = path.join(__dirname, "data");
  const errorLogPath = path.join(dirPath, "errors.txt");

  // ******************** Manejo de errores internos (500) ********************
  app.use((err, req, res, next) => {
    console.error("Error interno del servidor:", err.message);

    fs.mkdir(dirPath, { recursive: true }, (dirErr) => {
      if (dirErr) console.error("Error al crear el directorio data:", dirErr);

      fs.appendFile(
        errorLogPath,
        `[${new Date().toISOString()}] ${err.stack}\n`,
        (fileErr) => {
          if (fileErr) console.error("Error al escribir en errores:", fileErr);
        }
      );
    });
    res.status(500).render("Page404.ejs", { message: "Ups! Ha ocurrido un error. Vuelve a intentarlo más tarde", status: 500 ,
    user: req.user});
  });

  // ****************************** Iniciar servidor ****************************************
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

// Iniciar la aplicación
main().catch((err) => {
  console.error('❌ Error fatal al iniciar la aplicación:', err);
  process.exit(1);
});

// Mensajes de Error:
//     res.status(x).render("Page404.ejs", { message: "message", status: x , user: req.user});
