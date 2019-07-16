const express = require('express');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users')
mongoose.connect('mongodb+srv://prashant_jain:prashant_jain@node-rest-shop-fuyj9.mongodb.net/node-rest-shop-test?retryWrites=true&w=majority', { useNewUrlParser: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log(`we're connected!`)
})
mongoose.Promise = global.Promise
//for logging
app.use('/uploads', express.static('uploads')) //make folder available to public
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//CORS ERROR HANDLING
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({})
    }
    next()
})

//Routes which should handle requests
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/users', userRoutes)
//ERROR HANDLING
app.use((req, res, next) => {
    const error = new Error('NOT FOUND');
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports = app;
