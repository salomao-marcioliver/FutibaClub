const express = require('express')
const router = express.Router()

const init = connection => {
    router.get('/', async (req, res) => {
        const [rows, fields] = await connection.execute('select * from users')
        res.render('home')
    })

    router.get('/login', (req, res) => {
        res.render('login', { error: false })
    })

    router.post('/login', async (req, res) => {
        const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email])
        if (rows.length === 0) {
            res.render('login', { error: 'Usuário e/ou senha inválidos.' })
        } else {
            if (rows[0].passwd === req.body.passwd) {
                const userDb = rows[0]
                const user = {
                    id: userDb.id,
                    name: userDb.name,
                    role: userDb.role
                }
                req.session.user = user
                res.redirect('/')
            } else {
                res.render('login', { error: 'Usuário e/ou senha inválidos.' })
            }
        }
    })

    router.get('/logout', (req, res) => {
        req.session.destroy(err => {
            res.redirect('/')
        })
    })

    router.get('/new-account', (req, res) => {
        res.render('new-account', { error: false })
    })

    router.post('/new-account', async (req, res) => {
        const [rows, fields] = await connection.execute('select * from users where email = ?', [req.body.email])
        if (rows.length === 0) {
            const { name, email, passwd } = req.body
            const [inserted, insertFields] = await connection.execute('insert into users (name, email, passwd, role) values(?, ?, ?, ?)', [
                name,
                email,
                passwd,
                'user'
            ])
            const user = {
                id: inserted.insertId,
                name: name,
                role: 'user'
            }
            req.session.user = user
            res.redirect('/')
        } else {
            res.render('new-account', {
                error: 'Usuário já existente'
            })
        }
    })
    return router
}

module.exports = init