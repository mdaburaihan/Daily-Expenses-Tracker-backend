const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/me', [admin,auth], async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.name });
    if (user) return res.status(409).send('User alredy registered.');

    /*user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });*/
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    await user.save();

    //res.send(user);
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user, ['_id', 'name', 'email']));
   
    
});

module.exports = router;