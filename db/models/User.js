const { Schema, model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: true,
			trim: true,
			lowercase: true,
			maxlength: [15, 'Username can not be more than 15 characters'],
			minlength: [3, 'Username must be at least 3 characters'],
			validate: {
				validator: (name) => {
					name = name.trim();
					if (!validator.isAlphanumeric(name)) return false;
					if (!validator.isAlpha(name[0])) return false;
					return true;
				},
				message: (props) => `"${props.value}" is an invalid username`,
			},
		},
		displayName: {
			type: String,
			required: [true, 'Display Name is required'],
			trim: true,
			maxlength: [20, 'Display Name can not be more than 20 characters'],
			minlength: [3, 'Display Name must be at least 3 characters'],
			validate: {
				validator: (name) => {
					name = name.trim();
					if (!validator.isAlphanumeric(name.replace(/ /g, '')))
						return false;
					if (!validator.isAlpha(name[0])) return false;
					return true;
				},
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
			trim: true,
			lowercase: true,
			maxlength: [320, 'Email can not be more than 320 characters'],
			minlength: [5, 'Email must be at least 5 characters'],
			validate: {
				validator: validator.isEmail,
				message: (props) => `"${props.value}" is an invalid email`,
			},
		},
		mobileNumber: {
			type: String,
			required: [true, 'Mobile number is required'],
			trim: true,
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
