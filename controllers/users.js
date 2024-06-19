const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const UserModel = require('../models/users');

const getAllUsers = async (req, res) => {
	try {
		const users = await UserModel.find()
		return res.status(200).json(users);
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "ERROR"});
	}
}

const createUser = async (req, res) => {
	try {
		const user = _.pick(req.body, ["username", "pwd", "roles"]);
		const {error} = validateUser(user);
		if(error)
			return res.status(409).json(error);
		const encrytedPwd = await bcrypt.hash(user.pwd, 12);
		const savedUser = await UserModel.create({...user, pwd: encrytedPwd});
		return res.status(201).json(savedUser);
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Error while saving"})
	}
}

const updateUser = async(req, res) => {
	try {
		const { id } = req.params;
		const { username, roles, newPwd, pwd} = req.body;

		const user = await UserModel.findById(id);
		if (!user)
			return res.status(400).json({ message: "cannot perform the operation" });

		if(newPwd)
			if(!await bcrypt.compare(pwd, user.pwd))
				return res.status(400).json({message: "Old password is wrong"});
	
			user.username = username? username : user.username,
			user.roles = roles? roles : user.roles,
			user.pwd = newPwd && pwd ? await upadtePwd(newPwd, pwd, user.pwd) : user.pwd
	
		// const upadatedUser = await UserModel.findByIdAndUpdate(id, { username, roles, pwd: newPwd });
		const upadatedUser = await user.save();
		return res.status(201).json(upadatedUser);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
}

const deleteUser = async(req, res) => {
	try {
		const { id } = req.params;
		const deletedUser = await UserModel.findByIdAndDelete(id);
		return res.status(201).json(deletedUser);
	} catch (error) {
		
	}
}
const getUser = async(req, res) => {
	try {
		const {id} = req.params;
		const user = await UserModel.findById(id);
		if (!user)
			return res.status(400).json({ message: "user doesnot exist" });
		return res.status(201).json(user);
	} catch (error) {
		console.log(error);
		return res.status(500).json({message: "Error occured"})
	}
}

const upadtePwd = async(newPwd, currPwd, currEPwd) => {
	const matchOldPwd = await bcrypt.compare(currPwd, currEPwd);
	if(matchOldPwd)
		return await bcrypt.hash(newPwd, 12);
	return null;
}

const validateUser = (userObj) => {
	const userJoiSchema = Joi.object({
		username: Joi.string().min(3).required(),
		pwd: Joi.string().min(4).required(),
		roles: Joi.object({
			admin: Joi.number(),
			editor: Joi.number(),
			user: Joi.number(),
		})
	})
	return userJoiSchema.validate(userObj)
}

module.exports = {
	getAllUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
}