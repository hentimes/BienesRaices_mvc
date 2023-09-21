import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'

// Crear la APP
const app = express()

// Habilitar PUG
app. set('view engine', 'pug')
app.set('views', './views')

// Contenedor de archivos estaticos (publicos)

app.use (express.static('public'))

//Routing
app.use ('/auth', usuarioRoutes)




//Definir puerto y arrancar proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`El Servidor está funcionando en el puerto ${port}`)
});
