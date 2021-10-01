const awsIoT = require('aws-iot-device-sdk');
const incomingMessageHandler = require('./messageHandler');

var MqttBroker = awsIoT.device({
	keyPath: './_creds/private.pem.key',
	certPath: './_creds/certificate.pem.crt',
	caPath: './_creds/root-CA1.pem',
	clientId: 'server',
	host: `${process.env.AWS_IOT_HOST}.iot.${process.env.AWS_IOT_REGION}.amazonaws.com`,
	region: 'ap-south-1',
});

MqttBroker.on('message', incomingMessageHandler);

MqttBroker.on('connect', () => {
	console.log('Connected to AWS IoT!!');
	MqttBroker.publish(
		'RAS/Connections',
		JSON.stringify({
			message: 'A MqttBroker connected through Node.js SDK',
		})
	);
	MqttBroker.subscribe('RAS/DataPoints');
});

module.exports = MqttBroker;
