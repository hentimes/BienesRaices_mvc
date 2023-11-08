import express from "express"
import { body } from 'express-validator'
import { admin, crear, guardar, agregarImagen, almacenarImagen } from '../controllers/propiedadController.js'
import protegerRuta from "../middleware/protegerRuta.js"
import upload from '../middleware/subirImagen.js'

const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción es obligatoria')
        .isLength({ max: 20 }).withMessage('La descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Seleccionar una categoria'),
    body('precio').isNumeric().withMessage('Seleccionar un rango de precio'),
    body('habitaciones').isNumeric().withMessage('Seleccionar cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Seleccionar cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Seleccionar cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubicar propiedad en el mapa'),
    guardar
)

router.get('/propiedades/agregar-imagen/:id', 
    protegerRuta,
    agregarImagen
)

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    almacenarImagen
)

export default router