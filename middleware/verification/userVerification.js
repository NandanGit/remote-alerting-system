const jwt = require('jsonwebtoken');

const { catchAsync } = require('../errorHandling');
const CustomError = require('../../utils/customError');

const verifyUser = catchAsync(async (req, res, next) => {
	const { authtoken: authToken } = req.headers;

	if (!authToken) {
		return next(new CustomError('No auth token provided', 'authToken'));
	}

	jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return next(new CustomError('Invalid token', 'authToken'));
		}
		// console.log(decoded);

		req.user = decoded;

		next();
	});
});

module.exports = verifyUser;
