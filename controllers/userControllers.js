const bcrypt = require('bcryptjs');

const dbOps = require('../db/operations');
const { catchAsync } = require('../middleware/errorHandling');
const CustomError = require('../utils/CustomError');
const { validatePassword } = require('../utils/validators');

exports.updatePasswordController = catchAsync(async (req, res, next) => {
	const { oldPassword, newPassword } = req.body;
	if (!oldPassword || !newPassword) {
		return next(
			new CustomError(
				'Please provide old and new password',
				'missingFields'
			)
		);
	}
	// Check if the old password is correct
	const existingUser = await dbOps.User.findUserByUsername(req.user.username);
	if (!(await bcrypt.compare(oldPassword, existingUser.password)))
		throw new CustomError('Old password is incorrect', 'password');

	// Check if the new password is valid
	const passwordError = validatePassword(newPassword);
	if (passwordError) throw new CustomError(passwordError, 'password');

	// Check if the new password is same as old password
	if (await bcrypt.compare(newPassword, existingUser.password))
		throw new CustomError(
			'New password cannot be same as old password',
			'password'
		);

	// Hash the new password
	const hashedPassword = await bcrypt.hash(newPassword, 10);

	const updatedUser = await dbOps.User.updatePassword(
		req.user.username,
		hashedPassword
	);
	// res.json({
	// 	success: false,
	// 	message: 'You have reached updatePasswordController',
	// });
	res.json({
		success: true,
		message: 'Password updated successfully',
	});
});
