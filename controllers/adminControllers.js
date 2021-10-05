const dbOps = require('../db/operations');
const { catchAsync } = require('../middleware/errorHandling');
const CustomError = require('../Utils/CustomError');

exports.addDeviceController = catchAsync(async (req, res, next) => {
	res.json({
		msg: 'You have reached addDeviceController',
	});
});
