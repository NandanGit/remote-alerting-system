const { catchGeneralAsync } = require('../middleware/errorHandling');
const CustomError = require('../utils/customError');
const dbOps = require('../db/operations');

const handleIncomingDataPoints = catchGeneralAsync(async (payload) => {
	const { deviceId, dataPoints } = payload;
	console.log(`Received data points for device ${deviceId}`);
	console.log(dataPoints);
	if (!deviceId || !dataPoints)
		throw new CustomError(
			'Both deviceId and dataPoints must be provided',
			'missingFiends'
		);

	if (deviceId.length !== 16)
		throw new CustomError(
			'DeviceId must be 16 characters long',
			'invalidDeviceId'
		);

	// TODO: Send to Socket client if connected
	// socket.emit(`dataPoints:${deviceId}`, dataPoints, (err) => {});

	// TODO: Check if all the DataPoints are in range
	// If not, send an email to the listed recipients

	// DONE: Save to database
	// YOU WERE WORKING ON THIS!!!

	const updatedDevice = await dbOps.Device.addDataPoints(
		deviceId,
		dataPoints
	);
	console.log(updatedDevice);
	if (!updatedDevice) throw new CustomError('Device not found');
	// console.log(updatedDevice);
	console.log(`Added data to the device ${deviceId}`);
});

const messageHandler = (topic, payload) => {
	payload = JSON.parse(payload);
	switch (topic) {
		case 'RAS/DataPoints':
			handleIncomingDataPoints(payload);
			break;
		default:
			console.log(`topic "${topic}" is not handled`);
	}
};

module.exports = {
	messageHandler,
};
