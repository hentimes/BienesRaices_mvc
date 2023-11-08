import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

import Usuario from '../models/Usuario.js'
import { generarJWT, generarId } from '../helpers/tokens.js'
import { emailRegistro, olvidePasswordMail } from '../helpers/emails.js'


const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {
    // VALIDACION
    await check('email').isEmail().withMessage('El e-mail es obligatorio').run(req)
    await check('password').notEmpty().withMessage('El Password es obligatorio').run(req)

    let resultado = validationResult(req)

    // PREVENIR REGISTROS VACIOS
    if(!resultado.isEmpty()) {
    // MOSTRAR ERRORES
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { email, password } = req.body

    // COMPROBAR EXISTENCIA DE USUARIO
    const usuario = await Usuario.findOne({ where: { email }})
    if(!usuario) {

        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: "El usuario no existe"}]
        })
    }

    // COMPROBAR VALIDACION DE USUARIO
    if (!usuario.confirmado) {

        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: "Tu cuenta no ha sido confirmada"}]
        })
    }

    // REVISAR EL PASSWORD
    if(!usuario.verificarPassword(password)) {
        
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: "El password es incorrecto"}]
        })
    }

    // Autenticar al Usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre })

    console.log(token)

    // Almacenar en un cookies

    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true  Solo permite cookies en conexiones seguras. Con SSL
        //sameSite: true

    }).redirect('/mis-propiedades')
}

    
const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()
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
            csrfToken: req.csrfToken(),
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
    const existeUsuaruio = await Usuario.findOne ({ where : { email : req.body.email }})
    if(existeUsuaruio) {
        
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Ya existe un usuario con ese Email'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }


    // INICIO ALMACENAR USUARIO
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })


    // ENVIAR EMAIL DE CONFIRMACION
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // MOSTRAR MENSAJE DE CONFIRMACION
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un enlace de confirmacion a tu direccion de correo electronico.'
    })

}

    // CONFIRMAR CUENTA Y TOKEN
const confirmar = async (req, res) => {

    const  { token } = req.params;

        // VERIFICAR VALIDEZ DE TOKEN: TOKEN INVALIDO
    const usuario = await Usuario.findOne({ where: {token}})

    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta. Intenta de nuevo.',
            error: true
        })
    }
        // VERIFICAR VALIDEZ DE TOKEN: TOKEN VALIDO
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'Tu cuenta se confirmó correctamente.',
    })
        console.log(usuario)
}

    // RECUPERAR CUENTA
const formularioRecovery = (req, res) => {
    res.render('auth/recovery', {
        pagina: 'Recuperar Cuenta',
        csrfToken: req.csrfToken(),
    })
}

const resetPassword = async (req, res) => {

    await check('email').isEmail().withMessage('Ingrese un e-mail valido').run(req)
    let resultado = validationResult(req)


    // PREVENIR REGISTROS VACIOS
    if(!resultado.isEmpty()) {
    // INICIO MOSTRAS ERRORES
        return res.render('auth/recovery', {
            pagina: 'Recuperar Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    // BUSCAR USUARIO
    const {email} = req.body

    const usuario = await Usuario.findOne({ where: {email}})
    if(!usuario) {
        return res.render('auth/recovery', {
            pagina: 'Recuperar Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El E-mail no está registrado'}]
        })
    }

    // Generar token y enviar E-mail
    usuario.token = generarId();
    await usuario.save();

    // Enviar email
    olvidePasswordMail({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu password',
        mensaje: 'Hemos enviado un email con las instrucciones.'
    })
}

const comprobarToken = async (req, res) => {

    const { token } = req.params;


    const usuario = await Usuario.findOne({ where: {token}})

    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu información. Intenta de nuevo.',
            error: true
        })
    }

    // Formulario Modificar Password
    res.render ('auth/reset-password', {
        pagina: 'Reestablece Tu Password',
        csrfToken: req.csrfToken()
    })

}

const nuevoPassword = async (req, res) => {

    // Validar Password
    await check('password').isLength({min: 6}).withMessage('Ingrese al menos 6 caracteres').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {

        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu Password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const { token } = req.params
    const { password } = req.body;

    // Identificar usuario
    const usuario = await Usuario.findOne({ where: {token}})

    // Hashear password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(usuario.password, salt);
    usuario.token = null;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password Reestablecido',
        mensaje: 'El Password se guardó correctamente'
    })
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioRecovery,
    resetPassword,
    comprobarToken,
    nuevoPassword
}