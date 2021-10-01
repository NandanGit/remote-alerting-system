const handleIncomingDataPoints = (payload) => {
	const { deviceId, dataPoints } = payload;
	if (process.env.NODE_ENV !== 'production') {
		console.log(
			`\nThe device with id "${deviceId}" sent the following data`
		);
		console.log(dataPoints);
	}
};

const incomingMessageHandler = (topic, payload) => {
	payload = JSON.parse(payload);
	switch (topic) {
		case 'RAS/DataPoints':
			handleIncomingDataPoints(payload);
			break;
		default:
			console.log(`topic "${topic}" is not handled`);
	}
};

module.exports = incomingMessageHandler;
