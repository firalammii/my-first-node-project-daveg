const {ROLES_LIST} = require('../config/roles');

const authorize = (...allowedRoles) => {
	return (req, res, next) => {
		if(!req?.user.roles)
			return res.sendStatus(401);
		const userRoles = req.user.roles;
		const allowed = userRoles.filter(role => allowedRoles.includes(role));
		if(!allowed.length)
		  return res.sendStatus(401);
		next();
	}
}

const adminOnly = async(req, res, next) => {
	const user = req?.user;
	if(!user)
		return res.sendStatus(401);

	const roles = user.roles;
	if (!roles.includes(ROLES_LIST.admin))
		return res.sendStatus(401);

	next();
}

const editorOnly = async(req, res, next) => {
	const user = req?.user;
	if(!user)
		return res.sendStatus(401);

	const roles = user.roles;
	if (!roles.includes(ROLES_LIST.editor))
		return res.sendStatus(401);

	next();

}
const eitherAdminOrEditor = async(req, res, next) => {
	const user = req?.user;
	if(!user)
		return res.sendStatus(401);

	const roles = user.roles;
	if (!roles.includes(ROLES_LIST.admin) && !roles.includes(ROLES_LIST.editor))
		return res.sendStatus(401);

	next();
}

module.exports = {
	authorize,
	adminOnly,
	editorOnly,
	eitherAdminOrEditor,
}