const express = require('express');
const { adminOnly, eitherAdminOrEditor, authorize } = require('../../middlewares/authorize');
const { getAllUsers, createUser, updateUser, deleteUser, getUser } = require('../../controllers/users');
const { ROLES_LIST } = require('../../config/roles');

const router = express.Router();

router.route('/')
  .get(getAllUsers)
	.post([adminOnly, createUser]);

router.route('/:id')
	.get([eitherAdminOrEditor, getUser])
	.put([adminOnly, updateUser])
	.delete([authorize(ROLES_LIST.admin), deleteUser]);


module.exports = router;

