var mongoose = require('mongoose');

module.exports = mongoose.model('Users',{
	firstname: String,
	lastname: String,
	company: String,
	email: String,	
	username: String,
	password: String
});