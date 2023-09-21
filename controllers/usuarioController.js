
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

const formularioRecovery = (req, res) => {
    res.render('auth/recovery', {
        pagina: 'Recuperar Cuenta'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    formularioRecovery
}