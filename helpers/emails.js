import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const {email, nombre, token} = datos

    // ENVIAR MAIL
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre} confirma tu cuenta en BienesRaices.com</p>
            <p>Tu cuenta esta lista. Confirmala en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}"> Confirmar cuenta.</a> </p>

            <p>Si no creaste esta cuenta, por favor ignora este mensaje.</p>
        `
    })
    // FIN ENVIAR MAIL
}

//  OLVIDÉ PASSWORD
const olvidePasswordMail = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const {email, nombre, token} = datos

    // ENVIAR MAIL
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu Password en BienesRaices.com',
        text: 'Reestablece tu Password en BienesRaices.com',
        html: `
            <p>Hola ${nombre} has solicitado reestablecer tu Password en BienesRaices.com</p>
            <p>Sigue el siguiente enlace para generar un nuevo Password:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/recovery/${token}">Reestablecer Password.</a> </p>

            <p>Si no solicitaste el cambio de Password, por favor ignora este mensaje.</p>
        `
    })
    // FIN ENVIAR MAIL
}


export {
    emailRegistro,
    olvidePasswordMail
}