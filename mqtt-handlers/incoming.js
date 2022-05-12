const { catchGeneralAsync } = require('../middleware/errorHandling');
const CustomError = require('../utils/customError');
const dbOps = require('../db/operations');
const notifications = require('../notifications');

const handleIncomingDataPoints = catchGeneralAsync(async (payload) => {
	const { deviceId, dataPoints } = payload;
	console.log(`\nReceived data points for device ${deviceId}`);
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
	const ranges = await dbOps.Device.getDeviceRanges(deviceId);
	// console.log(ranges);
	ranges.forEach(async (range) => {
		const { label, min, max } = range;
		if (min > dataPoints[label] || max < dataPoints[label]) {
			console.log(`${label} is out of range`);
			// Get the recipient details
			const { recipients, deviceName } =
				await dbOps.Device.getDeviceRecipients(deviceId);
			console.log(`Sending alert to ${recipients}`);
			notifications.email.notify(recipients, {
				label,
				value: dataPoints[label],
				min,
				max,
				units: range.unit,
				device: {
					name: deviceName,
					id: deviceId,
				},
			});
		} else {
			console.log(`${label} is in range`);
		}
	});

	// DONE: Save to database
	const updatedDevice = await dbOps.Device.addDataPoints(
		deviceId,
		dataPoints
	);

	// console.log(updatedDevice);
	if (!updatedDevice) throw new CustomError('Device not found');
	// console.log(updatedDevice);
	// console.log(`Added data to the device ${deviceId}`);
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
