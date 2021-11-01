const userOps = require('./User');
const Device = require('../models/Device');
const CustomError = require('../../utils/CustomError');

exports.create = async (device) => {
	const existingDevice = await Device.findOne(
		{ deviceId: device.deviceId },
		{ deviceId: 1 }
	);
	if (existingDevice)
		throw new CustomError('Device already exists', 'device');
	const newDevice = new Device(device);
	const createdDevice = await newDevice.save();
	return createdDevice;
};

exports.add = async (device) => {
	console.log(device);
	const { username, secretKey, deviceId, userId } = device;
	// Working on THIS!!!!!
	const existingDevice = await Device.findOne({ deviceId });
	if (!existingDevice) throw new CustomError('Device not found', 'device');
	if (existingDevice.owner) {
		throw new CustomError('Device already exists', 'device');
	}
	if (existingDevice.secretKey !== secretKey)
		throw new CustomError('Invalid secret key', 'secretKey');
	if (device.displayName) {
		// Check if the display name is already taken by another device of the same user
		const existingDeviceWithDisplayName = await Device.findOne(
			{
				owner: userId,
				displayName: device.displayName,
			},
			{ displayName: 1 }
		);
		if (existingDeviceWithDisplayName)
			throw new CustomError(
				'Display name already taken by another device',
				'displayName'
			);
	}
	// const userId = await userOps.findIdByUsername(username);
	const updatedDevice = await Device.findOneAndUpdate(
		{ deviceId },
		{ ...device, owner: userId },
		{ runValidators: true, context: 'query', new: true }
	);
	if (!updatedDevice) throw new CustomError('Device not created', 'device');
	// Update the devices list of the user
	const updatedUser = await userOps.addDevice(userId, updatedDevice._id);
	// console.log(updatedUser);
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
			// new: true,
		}
	);
	return updatedDevice;
};
