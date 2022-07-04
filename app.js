const express = require('express')
const app = express()
const morgan = require('morgan')
const port = 5000
const routes = require('./routes')
const cookieParser = require('cookie-parser')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.static(__dirname + '/public'));

app.use('/', routes)

app.listen(port, ()=>{
    console.log(`app listen on ${port}`)
})