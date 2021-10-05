const CustomError = require('../../Utils/CustomError');
const { catchAsync } = require('../errorHandling');
const bcrypt = require('bcryptjs');

const verifyAdmin = catchAsync(async (req, res, next) => {
	// const { adminPassword } = req.body;
	// if (!adminPassword) {
	// 	return next(
	// 		new CustomError(
	// 			'Login along with the admin password to access this route'
	// 		)
	// 	);
	// }
	// // Hash the provided password
	// if (!(await bcrypt.compare(adminPassword, process.env.ADMIN_PASSWORD))) {
	// 	return next(new CustomError('Invalid admin password'));
	// }
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
