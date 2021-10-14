const express = require('express')
const router = express.Router()

const init = connection => {
    router.use((req, res, next) => {
        if (!req.session.user || req.session.user.role === 'user') {
            res.redirect('/')
        } else {
            next()
        }
    })
    router.get('/', (req, res) => {
        res.send('olá admin')
    })
    router.get('/games', async(req, res) => {
        const [rows, fields] = await connection.execute('select * from games')
        res.render('admin/games', {
            games: rows
        })
    })
    router.post('/games', async(req, res) => {
        const { team_a, team_b } = req.body
        await connection.execute('insert into games (team_a, team_b) values (?, ?)', [team_a, team_b])
        res.redirect('/admin/games')
    })
    router.get('/games/delete/:id', async(req, res) => {
        await connection.execute('delete from games where id = ? limit 1', [req.params.id])
        res.redirect('/admin/games')
    })
    return router
}

module.exports = init