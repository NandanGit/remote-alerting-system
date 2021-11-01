const dbOps = require('../db/operations');
const { catchAsync } = require('../middleware/errorHandling');
const CustomError = require('../utils/CustomError');

exports.createDeviceController = catchAsync(async (req, res, next) => {
	// res.json({
	// 	msg: 'You have reached createDeviceController',
	// });
	const createdDevice = await dbOps.Device.create(req.body);
	res.json({
		success: true,
		createdDevice,
	});
});
