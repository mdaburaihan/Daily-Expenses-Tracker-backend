const _ = require('lodash');
const {Product} = require('../models/product.model');
const express = require('express');
const Joi = require('joi');
const router = express.Router();


router.post('/add', async (req, res)=>{
    
    try{
        const productObj = new Employee({
            title: req.body.title,
            price: req.body.price,
            category: req.body.category,
            image_url: req.body.image_url
         });
     
         const schema = Joi.object().keys({
            title: Joi.string().required(),
            price: Joi.string().required(),
            category: Joi.integer().required(),
            image_url: Joi.string().required(),
         });
     
         const { error } = Joi.validate(req.body, schema);
     
         if(error){
             res.status(403).send(error.details[0].message);
         }
         
         const result = await productObj.save();
         
         if(result){
             res.status(200).send(result);
         }else{
             res.status(409).send({ message : "Some error occured." });
         }
    }catch(expp){
        console.log(expp);
        res.status(500).send(expp);
    }
   
});

router.get('/list', async (req, res)=>{

    try{
        const empList = await Employee.find({});

        res.status(200).send(empList);
    }catch(expp){
        console.log(expp);
        res.status(500).send(expp);
    }
});

module.exports = router;