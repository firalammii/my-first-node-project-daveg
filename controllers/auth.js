const { compare } = require("bcrypt");
const UserModel = require("../models/users");
const { sign } = require("jsonwebtoken");

const cookieOptions = { 
	httpOnly: true, 
	origin: "http://localhost:3500", 
	// sameSite: "none", 
	maxAge: 24 * 60 * 60 * 1000 
};
const handleLogin = async(req, res) => {
	try {
		const {username, pwd} = req.body;
		if(!username || !pwd)
			return res.status(400).json({message: "No sufficeint data for login"});
		const foundUser = await UserModel.findOne({username}).exec();
		if(!foundUser)
			return res.status(404).json({message: "Can not found you"});
		const matchPwd = await compare(pwd, foundUser.pwd);
		if(!matchPwd)
			return res.status(404).json({message: "Can not found you"});
		const tokenObj = {
			username: foundUser.username,
			roles: Object.values(foundUser.roles),
		}
		const accessToken = generateToken(tokenObj, process.env.ACCESS_TOKEN_SECRET, "60s");
		const refreshToken = generateToken(tokenObj, process.env.REFRESH_TOKEN_SECRET, "1d");
		
		foundUser.refreshToken = refreshToken;
		await foundUser.save();
		res.cookie('jwtrt', refreshToken, cookieOptions);
		return res.status(200).json({accessToken});
	} catch (error) {
		console.error(error);
		return res.status(500).json(error);
	}
}

const handleLogout = async(req, res) => {
	try {
		const refreshToken = req.cookies?.jwtrt;
		if(!refreshToken)
			return res.sendStatus(204);
		const foundUser = await UserModel.findOne({refreshToken}).exec();
		if(!foundUser){
			res.clearCookie('jwtrt', cookieOptions)
			return res.sendStatus(204)
		}
		foundUser.refreshToken = "";
		await foundUser.save();
		res.clearCookie('jwtrt', cookieOptions);
		return res.sendStatus(204);

	} catch (error) {
		console.error(error);
		return res.status(500).json(error);
	}
}


const generateToken = (obj, secret, duration) => {
	return sign(
		obj,
		secret,
		{expiresIn : duration}
	);
}

module.exports = {
	handleLogin,
	handleLogout,
}