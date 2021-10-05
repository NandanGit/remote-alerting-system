const dbOps = require('../db/operations');
const { catchAsync } = require('../middleware/errorHandling');
const CustomError = require('../Utils/CustomError');

exports.addDeviceController = catchAsync(async (req, res, next) => {
	// res.json({
	// 	msg: 'You have reached addDeviceController',
	// });
	const ownerName = req.body.ownerName;
	if (!ownerName) {
		return next(new CustomError('OwnerName not provided'));
	}
	const userId = await dbOps.User.findIdByUsername(ownerName);
	const createdDevice = await dbOps.Device.create({
		...req.body,
		owner: userId,
	});
	res.json({
		success: true,
		createdDevice,
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
