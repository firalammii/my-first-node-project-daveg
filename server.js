const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const {logger} = require ('./middlewares/logger');
const {authenticate} = require('./middlewares/authenticate');

const authRoute = require('./routes/auth');
const refreshRoute = require('./routes/refresh');
const usersRoute = require('./routes/apis/users');
const employeesRoute = require('./routes/apis/employees');
const rootRoute = require('./routes/root');
const mongoose = require('mongoose');
const connectDB = require('./config/db_conn');

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/", express.static(path.join(__dirname, 'public')));

app.use(logger);

app.get('/', rootRoute);
app.use('/auth', authRoute);
app.use('/refresh', refreshRoute);

app.use(authenticate);
app.use('/users', usersRoute);
app.use('/employees', employeesRoute);

app.all('*', (req, res) => {
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	} else if (req.accepts('json')) {
		res.json({ "error": "404 Not Found" });
	} else {
		res.type('txt').send("404 Not Found");
	}
});

// app.use(errorHandler);

const PORT = process.env.PORT || 3500;
mongoose.connection.once('open', () => {
	console.log('Connected to MongoDB');
	app.listen(PORT, () => console.log(`Server succesfully running on port ${PORT}`));
});
