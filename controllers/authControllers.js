const dbOps = require('../db/operations');
const { catchAsync } = require('../middleware/errorHandling');

exports.signupController = catchAsync(async (req, res, next) => {
	const createdUser = await dbOps.User.create(req.body);
	res.json({
		status: 'success',
		createdUser,
	});
});

exports.loginController = catchAsync(async (req, res, next) => {
	res.json({
		status: 'success',
	});
});

exports.updatePasswordController = catchAsync(async (req, res, next) => {
	res.json({
		status: 'success',
	});
});
