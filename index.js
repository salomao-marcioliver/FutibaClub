const express = require('express')
const app = express()
const path = require('path')
const mysql = require('mysql2/promise')
const session = require('express-session')
const account = require('./account')
const admin = require('./admin')
const groups = require('./groups')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(session({
    secret: 'fullstack-academy',
    resave: true,
    saveUninitialized: true
}))
app.use(express.static(path.join(__dirname, 'public')))




const init = async() => {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '@Marcioliver09',
        database: 'futiba-club'
    })

    app.use((req, res, next) => {
        if(req.session.user){
            res.locals.user = req.session.user
        }else{
            res.locals.user = false
        }
        next()
    })

    app.use(account(connection))
    app.use('/admin', admin(connection))
    app.use('/groups', groups(connection))

    app.listen(3000, (error) =>{
        if(error){
            console.log(error)
        }else{
            console.log('Servidor rodando...\n\nhttp://localhost:3000')
        }
    })
}
init()

