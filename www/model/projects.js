var mongoose = require('mongoose');

module.exports = mongoose.model('Projects',{
	id: String,
	name: String
});