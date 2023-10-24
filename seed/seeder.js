import { exit } from 'node:process'
import categorias from './categorias.js'
import precios from './precios.js'
import Categoria from '../models/Categoria.js'
import Precio from '../models/Precio.js'
import db from '../config/db.js'

const importarDatos = async () => {
    try {

        // Autenticar
        await db.authenticate()

        // Generar las columnas
        await db.sync()

        // Insertar los datos a db
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            // Propiedad.bulkCreate(propiedades)
        ])

        console.log('Datos importados correctamente')
        exit(0)         // exit 0: indica que no hubo error
        
    } catch (error) {
        console.log(error)
        exit(1)  // exit 1: indica que hubo error
    }
}

// Eliminar datos a db
const eliminarDatos = async () => {
    try {
        await db.sync({force: true})
        console.log('Datos eliminados correctamente')
        exit(0)
    } catch (error) {
        console.log(error)
        exit(1)
    }
}



if(process.argv[2] === "-i") {
    importarDatos();
}

if(process.argv[2] === "-e") {
    eliminarDatos();
}