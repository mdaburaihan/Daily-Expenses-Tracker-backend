const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('Joi');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
   
const userSchema = new mongoose.Schema({
	user_id: {
		type: Number,
		required: true
	},
	user_name: {
	   type: String,
	   required: true
	},
	user_email: {
	   type: String,
	   required: true,
	   unique: true
	},
	user_password: {
	   type: String,
	   required: true
	},
	isAdmin: Boolean,
	doc_utc: {
		type: Number,
		default: 0
	},
	dom_utc: {
		type: Number,
		default: 0
	},
}, { collection: 't_users' }, { strict: false });
autoIncrement.initialize(mongoose.connection);
userSchema.plugin(autoIncrement.plugin, {
	model: 't_users',
	field: 'user_id',
	startAt: 1,
	incrementBy: 1
})

userSchema.methods.generateAuthToken = function(){
	const token =  jwt.sign({ 
		_id: this._id, 
		user_id: this.user_id, 
		user_name: this.user_name, 
		user_email: this.user_email, 
	}, config.get('jwtPrivateKey'));
	return token;
}

 const User = mongoose.model('t_users', userSchema);


 function validateUser(user){
	const schema = {
		name: Joi.string().required(),
		email: Joi.string().required().email(),
		password: Joi.string().required(),
	};

	return Joi.validate(user, schema);
 }

 exports.User = User;
 exports.validate = validateUser;