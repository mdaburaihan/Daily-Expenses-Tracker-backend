const _ = require('lodash');
const {Employee} = require('../models/employee.model');
const express = require('express');
const Joi = require('joi');
const router = express.Router();


router.post('/add', async (req, res)=>{
    
    try{
        const employeeObj = new Employee({
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            contactPreference: req.body.contactPreference,
            dob: req.body.dob,
            department: req.body.department,
            photoPath: req.body.photoPath,
            isActive: req.body.isActive
         });
     
         const schema = Joi.object().keys({
             name: Joi.string().min(3).max(30).required(),
             email: Joi.string().email({ minDomainAtoms: 2 }).required(),
             gender: Joi.string().required(),
             phone: Joi.number().integer().min(10).required(),
             contactPreference: Joi.string().required(),
             dob: Joi.number().allow(""),
             department: Joi.string().required(),
             photoPath: Joi.string().allow(""),
             isActive: Joi.boolean().required()
         });
     
         const { error } = Joi.validate(req.body, schema);
     
         if(error){
             res.status(403).send(error.details[0].message);
         }
         
         const result = await employeeObj.save();
         
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