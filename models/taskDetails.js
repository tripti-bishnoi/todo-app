var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var taskDetailsSchema = {
	desc : String,
	completedFlag : Boolean,
	addedOn : Date,
	user : [ { type : Schema.Types.ObjectId, ref: User } ]
};

module.exports = mongoose.model('Task', taskDetailsSchema);