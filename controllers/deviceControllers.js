const dbOps = require('../db/operations');
const { catchAsync } = require('../middleware/errorHandling');
const CustomError = require('../utils/CustomError');

exports.addDeviceController = catchAsync(async (req, res, next) => {
	// res.json({
	// 	msg: 'You have reached addDeviceController',
	// });
	const { displayName, deviceId, secretKey } = req.body;
	if (!displayName || !deviceId || !secretKey) {
		return next(
			new CustomError(
				'Please provide all the fields (displayName, deviceId, secretKey)',
				'missingFields'
			)
		);
	}
	const addedDevice = await dbOps.Device.add({
		...req.body,
		username: req.user.username,
	});
	res.status(201).json({
		success: true,
		addedDevice,
	});
});

exports.removeDeviceController = catchAsync(async (req, res, next) => {
	res.json({
		msg: 'You have reached removeDeviceController',
	});
});

exports.updateDeviceController = catchAsync(async (req, res, next) => {
	res.json({
		msg: 'You have reached updateDeviceController',
	});
});
