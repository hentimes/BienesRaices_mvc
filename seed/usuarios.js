import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Henry',
        email: 'hen@hen.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)

    }
]

export default usuarios