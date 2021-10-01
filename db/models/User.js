const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: true,
			validate: {
				validator: (name) => {},
				message: (props) => `"${props.value}" is an invalid username`,
			},
		},
		displayName: {
			type: String,
			required: [true, 'Display Name is required'],
			validate: {
				validator: (name) => {},
				message: (props) =>
					`"${props.value}" is an invalid display name`,
			},
		},
		password: {
			type: String, // Hashed
			required: [true, 'Password is required'],
		},
		devices: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Device',
			},
		],
		email: {
			type: String,
			required: [true, 'Email is required'],
			validate: {
				validator: (email) => {
					const re =
						/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return re.test(String(email).toLowerCase());
				},
				message: (props) => `"${props.value}" is an invalid email`,
			},
		},
		mobileNumber: {
			type: String,
			required: [true, 'Mobile number is required'],
			validate: {
				validator: (mobNum) => {
					return /^\d{10}$/.test(String(mobNum));
				},
				message: (props) =>
					`${props.value} is an invalid mobile number`,
			},
		},
	},
	{ timestamps: true }
);

userSchema.virtual('deviceCount').get(function () {
	return this.devices.length;
});

const User = model('User', userSchema);
module.exports = User;
