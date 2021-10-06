const CustomError = require('../../utils/CustomError');
const { catchAsync } = require('../errorHandling');
const bcrypt = require('bcryptjs');

const verifyAdmin = catchAsync(async (req, res, next) => {
	if (!req.user.isAdmin) {
		return next(
			new CustomError(
				'Login along with the admin password to access this route'
			)
		);
	}
	next();
});

module.exports = verifyAdmin;
