const { verify } = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if(!authHeader || !authHeader.startsWith('Bearer'))
		return res.sendStatus(401);
	const accessToken = authHeader.split(' ')[1];
	verify(
		accessToken, 
		process.env.ACCESS_TOKEN_SECRET, 
		(err, decoded) => {
			if(err)
				return res.sendStatus(403);
			req.user = decoded;
			next()
		}
	)
}

module.exports = {
	authenticate
};