const Vonage = require('@vonage/server-sdk');

const vonage = new Vonage({
	apiKey: process.env.VONAGE_API_KEY,
	apiSecret: process.env.VONAGE_API_SECRET,
});

exports.alert = (
	receivers,
	{ min, max, value, units, device, readingName }
) => {
	const content = `
    The device named "${device.name}" with the id "${
		device.id
	}" has recorded a ${readingName} of "${value} ${units}" which is ${
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
			vonage.message.sendSms(
				from,
				receiver,
				content,
				(err, responseData) => {
					if (err) {
						console.log(err);
					} else {
						if (responseData.messages[0]['status'] === '0') {
							console.log(
								`Message sent successfully to ${receiver}`
							);
						} else {
							console.log(
								`Message failed with error: ${responseData.messages[0]['error-text']}`
							);
						}
					}
				}
			);
			// console.log(`Sending alert to ${receiver}...`);
			// await sgMail.send({
			// 	to: receiver,
			// 	from: process.env.SENDGRID_SENDER_EMAIL,
			// 	subject: `${readingName} is out of range`,
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

// A function to find if a number is even or odd
exports.isEven = (num) => {
	return num % 2 === 0;
};

// A function to find if a number is prime or not
exports.isPrime = (num) => {
	for (let i = 2; i < num; i++) {
		if (num % i === 0) return false;
	}
	return num > 1;
};

// A function to find if a number is palindrome or not
exports.isPalindrome = (num) => {
	return num.toString() === num.toString().split('').reverse().join('');
};

// A function to generate a random sequence of length n
exports.randomSequence = (n) => {
	let sequence = '';
	for (let i = 0; i < n; i++) {
		sequence += Math.floor(Math.random() * 10);
	}
	return sequence;
};

exports.isPerfectSquare = (num) => {
	return Math.sqrt(num) % 1 === 0;
};

exports.isPerfectCube = (num) => {
	return Math.cbrt(num) % 1 === 0;
};
