const userOps = require('./User');
const Device = require('../models/Device');
const CustomError = require('../../utils/CustomError');

exports.create = async (device) => {
	const newDevice = new Device(device);
	const createdDevice = await newDevice.save();
	return createdDevice;
};

exports.add = async (device) => {
	console.log(device);
	const { username, secretKey, deviceId } = device;
	// Working on THIS!!!!!
	const existingDevice = await Device.findOne({ deviceId });
	if (!existingDevice) throw new CustomError('Device not found', 'device');
	if (existingDevice.secretKey !== secretKey)
		throw new CustomError('Invalid secret key', 'secretKey');
	const userId = await userOps.findIdByUsername(username);
	const updatedDevice = await Device.findOneAndUpdate(
		{ deviceId },
		{ ...device, owner: userId },
		{ runValidators: true, context: 'query', new: true }
	);
	return updatedDevice;
};

exports.addDataPoints = async (deviceId, dataPoints) => {
	// console.log(dataPoints);
	const updatedDevice = await Device.updateOne(
		{ deviceId },
		{ $push: { readings: { dataPoints } } },
		{
			runValidators: true,
			context: 'query',
			new: true,
		}
	);
	return updatedDevice;
};
