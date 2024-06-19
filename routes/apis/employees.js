const express = require('express');
const {ROLES_LIST} = require('../../config/roles');
const { authorize, eitherAdminOrEditor } = require('../../middlewares/authorize');
const { getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployee } = require('../../controllers/employees');

const router = express.Router();

router.route('/')
  .get(getAllEmployees)
	.post([eitherAdminOrEditor, createEmployee]);

router.route('/:id')
	.get([authorize(ROLES_LIST.admin, ROLES_LIST.editor), getEmployee])
	// .get([eitherAdminOrEditor, getEmployee])
	.put([eitherAdminOrEditor, updateEmployee])
	.delete([eitherAdminOrEditor,deleteEmployee]);


module.exports = router;