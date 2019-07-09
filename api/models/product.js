const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type : String ,required : true},
    price : {type : Number ,required : true},
})
// const Joi = require('@hapi/joi');
// const Joigoose = require('joigoose')(mongoose);
// const joiProductSchema = Joi.object().keys({
//     name: Joi.string().alphanum().min(3).max(30).required(),
//     price : Joi.number().required(),
// })
// var productSchema = new mongoose.Schema(Joigoose.convert(joiProductSchema))
module.exports = mongoose.model('Product',productSchema)