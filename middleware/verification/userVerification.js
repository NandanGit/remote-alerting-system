const jwt = require('jsonwebtoken');

const { catchAsync } = require('../errorHandling');
const CustomError = require('../../utils/customError');

const verifyUser = catchAsync(async (req, res, next) => {
	const { authToken } = req.body;

	if (!authToken) {
		return next(new CustomError('No auth token provided'));
	}

	jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return next(new CustomError('Invalid token'));
		}

		req.user = decoded;

		next();
	});
});

module.exports = verifyUser;
