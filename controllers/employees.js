const _ = require('lodash');
const Joi = require('joi');

const EmployeeModel = require('../models/employee');

const getAllEmployees = async(req, res)=> {
	try {
		const employees = await EmployeeModel.find();
		return res.status(200).json(employees);
	} catch (error) {
		console.error(error);
		return res.status(500).json(error)
	}
}

const createEmployee = async (req, res) => {
	try {
		const empObj = _.pick(req.body, ["fname", "lname", "salary", "position", "tel_num"]);
		const { error } = validateEmp(empObj);
		if (error)
			return res.status(409).json({ message: error });
		const duplicate = await EmployeeModel.findOne({tel_num: empObj.tel_num}).exec();
		if(duplicate)
			return res.status(400).json({message: `employee with the tel no: ${empObj.tel_num} exists`});
		const employee = await EmployeeModel.create(empObj);
		return res.status(201).json(employee);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: error})
	}
}

const updateEmployee = async (req, res) => {
	try {
		const { id } = req.params;
		const empObj = _.pick(req.body, ["fname", "lname", "salary", "position", "tel_num"]);
		const employee = await EmployeeModel.findById(id);
		if(!employee)
			return res.status(400).json({message: " Employee does not found"});
		if(empObj.tel_num){
			const duplicate = await EmployeeModel.findOne({ tel_num:empObj.tel_num }).exec();
			if (duplicate)
				return res.status(400).json({ message: `employee with the tel no: ${empObj.tel_num} exists` });
		}
		employee.fname = empObj.fname ? empObj.fname : employee.fname;
		employee.lname = empObj.lname ? empObj.lname : employee.lname;
		employee.salary = empObj.salary ? empObj.salary : employee.salary;
		employee.position = empObj.position ? empObj.position : employee.position;
		employee.tel_num = empObj.tel_num ? empObj.tel_num : employee.tel_num;

		const updated = await employee.save();
		return res.status(201).json(updated);
	} catch (error) {
		console.error(error);
		return res.status(500).json(error)
	}
}

const deleteEmployee = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);
		return res.status(200).json(deletedEmployee);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: error});
	}
}
const getEmployee = async (req, res) => {
	try {
		const { id } = req.params;
		const employee = await EmployeeModel.findById(id);
		return res.status(200).json(employee);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: error });
	}
}

const checkTelNum = (tel_num) => {
	return employees.find(emp => emp.tel_num === tel_num);
}

const validateEmp =(empObj) => {
	const schema = Joi.object({
		fname: Joi.string().min(3).required(),
		lname: Joi.string().min(3).required(),
		salary: Joi.number().required(),
		position: Joi.string().min(3).required(),
		tel_num: Joi.string().min(9).required(),
	});
	return schema.validate(empObj);
}

module.exports = {
	getAllEmployees,
	getEmployee,
	createEmployee,
	updateEmployee,
	deleteEmployee,
}