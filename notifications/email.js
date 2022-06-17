const sgMail = require('@sendgrid/mail');
const { alert: smsAlert } = require('./sms');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.alert = (receivers, { min, max, value, units, device, label }) => {
	const content = `
    <p>The device named <b>${device.name}</b> with the id <b>${
		device.id
	}</b> has recorded a ${label} of <b>${value}<i>${units}</i></b> which is ${
		value < min
			? 'less than the minimum value'
			: 'greater than the maximum value'
	} <b>${value < min ? min : max}<i>${units}</i></b>
    </p>
    <p>
    You got this message because you are subscribed to the above mentioned device.</p>`;
	receivers.forEach(async (receiver) => {
		try {
			console.log(`Sending alert to ${receiver}...`);
			await sgMail.send({
				to: receiver,
				from: process.env.SENDGRID_SENDER_EMAIL,
				subject: `${label} is out of range`,
				text: content,
				html: content,
			});
			console.log(`Alert sent to ${receiver} :)`);
		} catch (err) {
			console.log(`Failed to send the alert to ${receiver}`);
			console.log(err);
		}
	});
	// console.log(content);
};

exports.notify = (receivers, param) => {
	// console.log(receivers, param);
	const emailReceivers = receivers
		.filter((receiver) => receiver.type === 'email')
		.map((receiver) => receiver.value);
	this.alert(emailReceivers, param);
	const smsReceivers = receivers
		.filter((receiver) => receiver.type === 'sms')
		.map((receiver) => receiver.value);
	console.log(smsReceivers);
	smsAlert(smsReceivers, param);
	const content = `
	
	`;
};
