import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarId } from '../helpers/tokens.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'

    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta'
    })
}

const registrar = async (req, res) => {

    // INICIO VALIDACION
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Ingrese un e-mail valido').run(req)
    await check('password').isLength({min: 6}).withMessage('Ingrese al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Introduzca Passwords similares').run(req);

    let resultado = validationResult(req)
    // FIN VALIDACION

    // PREVENIR REGISTROS VACIOS
    if(!resultado.isEmpty()) {

        
    // INICIO MOSTRAS ERRORES
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })

    }

    const {nombre, email, password } = req.body
    // FIN MOSTRAR ERRORES

    // INICIO PREVENIR USUARIOS DUPLICADOS
    const existeUsuaruio = await Usuario.findOne ({ where : {email : req.body.email}})
    if(existeUsuaruio) {
        
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: [{msg: 'Ya existe un usuario con ese Email'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    // FIN PREVENIR USUARIOS DUPLICADOS

    // INICIO ALMACENAR USUARIO
    await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })
    // FIN ALMACENAR USUARIO

    //MOSTRAR MENSAJE DE CONFIRMACION
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un E-Mail de confirmación. Presiona en el enlace.'
    })
}

const formularioRecovery = (req, res) => {
    res.render('auth/recovery', {
        pagina: 'Recuperar Cuenta'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioRecovery
}