const User = require('../models/User');

exports.create = async (user) => {
	const newUser = new User(user);
	const createdUser = await newUser.save();
	return createdUser;
};
