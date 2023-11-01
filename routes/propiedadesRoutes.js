import express from "express"
import { body } from 'express-validator'
import { admin, crear, guardar } from '../controllers/propiedadController.js'

const router = express.Router()

router.get('/mis-propiedades', admin)
router.get('/propiedades/crear', crear)
router.post('/propiedades/crear', 
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


export default router