const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const dbOps = require('../db/operations');
const { catchAsync } = require('../middleware/errorHandling');
const CustomError = require('../utils/CustomError');

exports.signupController = catchAsync(async (req, res, next) => {
	// Hash the password
	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	// Prevent user from not verifying the password
	req.body.isVerified = false;
	const createdUser = await dbOps.User.create(req.body);

	// Create a token
	const user = {
		username: createdUser.username,
		email: createdUser.email,
		displayName: createdUser.displayName,
		devices: createdUser.devices,
	};
	const authToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
	res.json({
		success: true,
		createdUser,
		authToken,
	});
});

exports.loginController = catchAsync(async (req, res, next) => {
	const { username, password, adminPassword } = req.body;
	if (!username || !password) {
		return next(new CustomError('Username and password are required'));
	}

	// Compare the hashed password with the provided password
	const existingUser = await dbOps.User.findUserByUsername(username);
	// return res.json({});
	if (!existingUser) {
		return next(new CustomError('Invalid Username'));
	}

	if (!(await bcrypt.compare(password, existingUser.password))) {
		return next(new CustomError('Invalid Password'));
	}

	// Create a token
	const user = {
		username: existingUser.username,
		email: existingUser.email,
		displayName: existingUser.displayName,
		devices: existingUser.devices,
	};

	user.isAdmin = false;
	if (adminPassword) {
		if (
			!(await bcrypt.compare(adminPassword, process.env.ADMIN_PASSWORD))
		) {
			return next(new CustomError('Invalid admin password'));
		}
		user.isAdmin = true;
	}

	const authToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

	res.json({
		success: true,
		authToken,
		isAdmin: user.isAdmin,
	});
});
