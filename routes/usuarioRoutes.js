
import express from 'express';
import { formularioLogin, formularioRegistro, formularioRecovery } from '../controllers/usuarioController.js'

const router = express.Router();

router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro)
router.get('/recovery', formularioRecovery)


export default router;