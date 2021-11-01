const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const dbOps = require('../db/operations');
const { catchAsync } = require('../middleware/errorHandling');
const CustomError = require('../utils/CustomError');

exports.signupController = catchAsync(async (req, res, next) => {
	// Prevent user from not verifying the password
	req.body.isVerified = false;
	const createdUser = await dbOps.User.create(req.body);

	// Create an account verification token
	const verificationToken = jwt.sign(
		createdUser.username,
		process.env.VERIFICATION_TOKEN_SECRET
	);

	// Send the verification email
	if (process.env.NODE_ENV !== 'production') {
		return res.json({
			success: true,
			verificationLink: `http://127.0.0.1:${process.env.PORT}/auth/verify-account/${verificationToken}`,
		});
	}

	// Send the success message
	res.json({
		success: true,
		message:
			'Account created successfully, check the registered email for verification link',
	});
});

exports.loginController = catchAsync(async (req, res, next) => {
	const { username, password, adminPassword } = req.body;
	if (!username || !password) {
		return next(
			new CustomError(
				'Username and password are required',
				'missingFields'
			)
		);
	}

	// Compare the hashed password with the provided password
	const existingUser = await dbOps.User.findUserByUsername(username);
	// return res.json({});
	if (!existingUser) {
		return next(new CustomError('Invalid Username', 'username'));
	}

	if (!(await bcrypt.compare(password, existingUser.password))) {
		return next(new CustomError('Invalid Password', 'password'));
	}

	// Check if the user account is verified
	if (!existingUser.isVerified) {
		return next(
			new CustomError(
				'Account is not verified, Check you registered email for the verification link',
				'notVerified'
			)
		);
	}

	// Create a token
	const user = {
		username: existingUser.username,
		email: existingUser.email,
		displayName: existingUser.displayName,
		devices: existingUser.devices,
		id: existingUser._id,
	};

	user.isAdmin = false;
	if (adminPassword) {
		if (
			!(await bcrypt.compare(adminPassword, process.env.ADMIN_PASSWORD))
		) {
			return next(new CustomError('Invalid admin password', 'password'));
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

exports.verifyAccountController = catchAsync(async (req, res, next) => {
	// Extract the verificationToken from the url
	const { token: verificationToken } = req.params;
	if (!verificationToken) {
		return next(
			new CustomError('Invalid verification token', 'verificationToken')
		);
	}

	// Verify the token
	const username = jwt.verify(
		verificationToken,
		process.env.VERIFICATION_TOKEN_SECRET
	);

	// Change the verification status of the user
	const verifiedUser = await dbOps.User.changeVerificationStatus(username);

	res.json({
		success: true,
		message:
			'Account verified successfully, You can now login with your username and password',
	});
});
