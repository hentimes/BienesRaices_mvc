
import express from 'express';
import { formularioLogin, formularioRegistro, registrar, confirmar, formularioRecovery, resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioController.js'

const router = express.Router();

router.get('/login', formularioLogin);

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get ('/confirmar/:token', confirmar)

router.get('/recovery', formularioRecovery)
router.post('/recovery', resetPassword)

// ALMACENA EL NUEVO PASSWORD

router.get('/recovery/:token', comprobarToken);
router.post('/recovery/:token', nuevoPassword);


export default router;