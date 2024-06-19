const {format} = require('date-fns');
const {v4: uuid} = require('uuid');

const logger = (req, res, next) => {
	const date = format(new Date(), 'yyyy-mmm-dd  hh:mm:ss');
	const logData = `${date}  pid:${uuid()}  ${req.url}  ${req.method}`
	console.log(logData);
	next();
}


module.exports  = {
	logger,
}