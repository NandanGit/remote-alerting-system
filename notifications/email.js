const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.notify = (receivers, message) => {};

exports.alert = (
	receivers,
	{ min, max, value, units, device, readingName }
) => {
	const content = `
    <p>The device named <b>${device.name}</b> with the id <b>${
		device.id
	}</b> has recorded a ${readingName} of <b>${value}<i>${units}</i></b> which is ${
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
				subject: `${readingName} is out of range`,
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
