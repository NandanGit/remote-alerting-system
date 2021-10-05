const Device = require('../models/Device');

exports.create = async (device) => {
	const newDevice = new Device(device);
	const createdDevice = await newDevice.save();
	return createdDevice;
};
