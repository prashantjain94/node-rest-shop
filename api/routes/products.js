const express = require('express')
const router = express.Router()
const Joi = require('@hapi/joi');
const Product = require('../models/product')
const mongoose = require('mongoose')
router.get('/',(req,res,next) => {
    Product.find()
    .select('name price _id') //to select particular fields
    .exec()
    .then(docs => {
        const response = {
            count : docs.length,
            products : docs.map(doc => {
                return {
                    name : doc.name,
                    price : doc.price,
                    _id : doc._id,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/products/'+doc._id
                    }
                }
            })
        }
        // if (docs.length >= 0) {
            res.status(200).json(response)
        // }else{
        //     req.status(404).json({
        //         message : 'No entries found'
        //     })
        // }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        })
    })
})

router.post('/',(req,res,next) => {
    const rules = Joi.object().keys({
        name: Joi.string().alphanum().min(3).max(30).required(),
        price : Joi.number().required(),
        details: Joi.object({
            size : Joi.number().required()
        }).required(),
        details1: Joi.object({
            size : Joi.number().required()
        }).required(),
    })

    const {error, value} = Joi.validate(req.body, rules, {abortEarly : false})
    if(error){
        console.log(value)
        var e1=[]
        var e2=[]
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>')
        console.log(error['details'])
        for(var i = 0; i < error['details'].length;i++){
            console.log(error['details'][i]['message'])
            e1.push(error['details'][i]['path'])
            e1.push(error['details'][i]['message'])
           
        }
        console.log(e2)
       
    }else{
        console.log('validation passed')
    }
    const product = new Product({
        _id : mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price

    })
    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created product successfully',
                createProduct: {
                    name: result.name,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                error : err
            })
        })

})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
    .select('name price _id ')
        .then(doc => {
            console.log(doc)
            if(doc){
                res.status(200).json({
                    product : doc,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/products/'
                    }
                })
            }else{
                res.status(404).json({message : 'No valid entry found for provided ID'})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(200).json({ error: err })
        })
})


router.patch('/:productId',(req,res,next) => {
    const id = req.params.productId
    // const updateOps = {}
    // for (const key of Object.keys(req.body)) {
    //     updateOps[key] = req.body[key]
    // }
    // Product.update({
    //     _id : id
    // },{$set : updateOps})
    Product.update({_id:req.params.productId}, {$set: req.body}  )
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Product updated',
            request : {
                type: 'GET',
                url : 'http://localhost:3000/products/'+id
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        })
    })
})

router.delete('/:productId',(req,res,next) => {
    const id = req.params.productId
    Product.remove({
        _id : id 
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Product deleted',
            url : 'localhost:3000/products/'+id,
            data : {
                name : 'String',
                price : 'Number'
            }
        })
    })
   .catch(err => {
       console.log(err)
       res.status(500).json({
           error : err
       })
   })
})


module.exports = router