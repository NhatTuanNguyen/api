const {Schema} = require('mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
const databaseConfig = require(__path_configs + 'database');
const systemConfig = require(__path_configs + 'system');
const notify = require(__path_configs + 'notify');

var schema = new mongoose.Schema({
	username: String,
	email: String,
	role: String,
	password: String,
	resetPassToken: String,
	resetPassTokenExp: String,
  	
});

schema.pre('save', function(next){
	if(!this.isModified('password')) {
		return next();
	}
	var salt = bcrypt.genSaltSync(10);
	this.password = bcrypt.hashSync(this.password, salt);
	next();
});

schema.methods.resetPassword = function(){
	const resetToken = crypto.randomBytes(20).toString('hex');

	this.resetPassToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.resetPassTokenExp = Date.now() + 5*60*1000;
	return resetToken;
}

schema.methods.getSignedJwtToken = function(){
	return jwt.sign({id: this._id},systemConfig.JWT_SECRET,{expiresIn: systemConfig.JWT_EXP})
}

schema.methods.updateNew = async function(usernew){
	const isMatch = await bcrypt.compare(usernew.password,this.password);
	if(!isMatch) {
		var salt = bcrypt.genSaltSync(10);
		usernew.password = bcrypt.hashSync(usernew.password, salt);
	} else {
		usernew.password = this.password;
	}
	return usernew;
}

schema.statics.findByCredentials = async function(email,password){
	// Check empty
	if(!email || !password) return {err:notify.ERROR_LOGIN}

	// Check email
	const user = await this.findOne({email});
	if(!user) return {err:notify.ERROR_LOGIN}

	// Check password
	const isMatch = await bcrypt.compare(password, user.password);
	if(!isMatch) return {err:notify.ERROR_LOGIN}
	return {user}
}

module.exports = mongoose.model(databaseConfig.col_users, schema);