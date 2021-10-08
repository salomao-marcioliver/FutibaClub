const express = require('express')
const app = express()
const path = require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home')
})

app.listen(3000, (error) =>{
    if(error){
        console.log(error)
    }else{
        console.log('Servidor rodando...\n\nhttp://localhost:3000')
    }
})