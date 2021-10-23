const CustomError = require('../../utils/CustomError');
const User = require('../models/User');

exports.create = async (user) => {
	const newUser = new User(user);
	const createdUser = await newUser.save();
	return createdUser;
};

exports.findUserByUsername = async (username) => {
	const foundUser = await User.findOne({ username });
	return foundUser;
};

exports.findIdByUsername = async (username) => {
	const foundUser = await User.findOne({ username }, { _id: 1 });
	if (foundUser) {
		return foundUser._id;
	}
	throw new CustomError('User not found', 'user');
};

exports.updatePassword = async (username, password) => {
	// const password =
	const updatedUser = await User.findOneAndUpdate(
		{ username },
		{ password },
		{ new: true }
	);
	return updatedUser;
};

exports.changeVerificationStatus = async (username) => {
	const updatedUser = await User.findOneAndUpdate(
		{ username },
		{ isVerified: true },
		{ new: true }
	);
	return updatedUser;
};

exports.addDevice = async (userId, deviceId) => {
	const updatedUser = await User.findByIdAndUpdate(
		userId,
		{ $push: { devices: deviceId } },
		{ new: true }
	);
	return updatedUser;
};
