const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
	fname: {
		type: String,
		required: true,
	},
	lname: {
		type: String,
		required: true,
	},
	tel_num: {
		type: String,
		required: true,
	},
	salary: {
		type: Number,
		required: true,
	},
	position: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const EmployeeModel = mongoose.model('employees', employeeSchema);

module.exports = EmployeeModel;