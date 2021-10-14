const express = require('express')
const router = express.Router()

const init = connection => {
    router.get('/', async (req, res) => {
        try {
            const [groups, fields] = await connection.execute('select * from groups')
            res.render('groups', {
                groups
            })
        } catch (error) {
            console.log(error)
        }
    })
    return router
}

module.exports = init