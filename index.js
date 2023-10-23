//                  imports
import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import db from './config/db.js'

//                  Crear la APP
const app = express()

// Habilitar lectura de datos de formulario
app.use(express.urlencoded({extended: true}))

// Habilitar cookie parser
app.use (cookieParser() )

// Habilitar CSRF
app.use( csrf({cookie: true}) )


//                  Conexion a la Base de Datos
try {
    await db.authenticate();
    db.sync()
    console.log('Conexion Correcta a la Base de Datos')
} catch (error) {
    console.log('error al conectar con base de datos')
}

//                  Habilitar PUG
app.set('view engine', 'pug')
app.set('views', './views')

//                  Contenedor de archivos estaticos (publicos)
app.use (express.static('public'))

//                  Routing
app.use ('/auth', usuarioRoutes)
app.use ('/', propiedadesRoutes)

//                  Definir puerto y arrancar proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`El Servidor está funcionando en el puerto ${port}`)
});
