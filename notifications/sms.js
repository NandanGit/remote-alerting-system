const Vonage = require('@vonage/server-sdk');

const vonage = new Vonage({
	apiKey: process.env.VONAGE_API_KEY,
	apiSecret: process.env.VONAGE_API_SECRET,
});

const smsClient = require('twilio')(
	process.env.TWILIO_SID,
	process.env.TWILIO_AUTH_TOKEN
);

exports.alert = (receivers, { min, max, value, units, device, label }) => {
	const content = `
    The device named "${device.name}" with the id "${
		device.id
	}" has recorded a ${label} of "${value} ${units}" which is ${
		value < min
			? 'less than the minimum value'
			: 'greater than the maximum value'
	} "${value < min ? min : max} ${units} "
    
    
    You got this message because you are subscribed to the above mentioned device.`;
	const from = process.env.VONAGE_FROM; // 'Remote Alerting SYSTEM';
	receivers.forEach(async (receiver) => {
		try {
			// const receiver = '919989293194';
			// const content = 'A content message sent using the Vonage SMS API';
			console.log(`Sending message to ${receiver}`);
			smsClient.messages
				.create({
					to: receiver,
					from: process.env.TWILIO_NUMBER,
					body: content,
				})
				.then((msg) => console.log(`Sent SMS to ${receiver}`))
				.catch((err) =>
					console.log(`Error sending SMS to ${receiver}`)
				);
			// vonage.message.sendSms(
			// 	from,
			// 	receiver,
			// 	content,
			// 	(err, responseData) => {
			// 		if (err) {
			// 			console.log(err);
			// 		} else {
			// 			if (responseData.messages[0]['status'] === '0') {
			// 				console.log(
			// 					`Message sent successfully to ${receiver}`
			// 				);
			// 			} else {
			// 				console.log(
			// 					`Message failed with error: ${responseData.messages[0]['error-text']}`
			// 				);
			// 			}
			// 		}
			// 	}
			// );
			// console.log(`Sending alert to ${receiver}...`);
			// await sgMail.send({
			// 	to: receiver,
			// 	from: process.env.SENDGRID_SENDER_EMAIL,
			// 	subject: `${label} is out of range`,
			// 	text: content,
			// 	html: content,
			// });
			// console.log(`Alert sent to ${receiver} :)`);
		} catch (err) {
			// console.log(`Failed to send the alert to ${receiver}`);
			// console.log(err);
		}
	});
	// console.log(content);
};

exports.verifyAccountSMS = (number, link) => {
	const content = `
	Welcome to Remote Alerting System!
	To verify your account, please click on the following link:
	${link}
	`;
	console.log(`Sending verification link to ${number}`);
	smsClient.messages
		.create({
			to: number,
			from: process.env.TWILIO_NUMBER,
			body: content,
		})
		.then((msg) => console.log(`Sent verification link to ${number}`))
		.catch((err) =>
			console.log(`Error sending verification link to ${number}`)
		);
};
