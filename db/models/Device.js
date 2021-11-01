const { Schema, model } = require('mongoose');
const validator = require('validator');

const deviceSchema = new Schema(
	{
		deviceId: {
			type: String,
			required: [true, 'DeviceId is required'],
			unique: true,
			trim: true,
			uppercase: true,
			unmodifiable: true,
			validate: {
				validator: (id) => {
					return /^[0-9A-F]{16}$/.test(id);
				},
				message: (props) => `${props.value} is not a valid device id`,
			},
		},
		secretKey: {
			type: String,
			required: [true, 'SecretKey is required'],
			trim: true,
			unmodifiable: true,
			validate: {
				validator: (id) => {
					return /^[a-zA-Z0-9!@#$]{8}$/.test(id);
				},
				message: (props) => `${props.value} is not a valid secret key`,
			},
		},
		displayName: {
			type: String,
			// required: [true, 'Display Name is required'],
			default: 'Device Name',
			trim: true,
			maxlength: [50, 'Display Name can not be more than 50 characters'],
			minlength: [3, 'Display Name must be at least 3 characters'],
			length: [3, 20],
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
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			// required: [true, 'Owner is required'],
		},
		// isVerified: {
		// 	type: Boolean,
		// 	default: false,
		// },
		ranges: [
			new Schema(
				{
					label: {
						type: String,
						required: [true, 'Label is required'],
					},
					min: {
						type: Number,
						required: [true, 'Minimum Threshold is required'],
					},
					max: {
						type: Number,
						required: [true, 'Maximum Threshold is required'],
					},
					unit: {
						type: String,
						required: [true, 'Unit is required'],
					},
				},
				{ _id: false }
			),
		],
		readings: [
			new Schema(
				{
					dataPoints: {
						type: Object,
						required: [true, 'Data Points are required'],
					},
				},
				{
					timestamps: { createdAt: true, updatedAt: false },
					_id: false,
				}
			),
		],
		recipients: [
			new Schema(
				{
					name: {
						type: String,
						required: [true, 'Recipient name is required'],
					},
					type: {
						type: String,
						enum: {
							values: ['email', 'sms'],
							message:
								'Recipient type must be either email or sms',
						},
						required: [true, 'Email or SMS type is required'],
					},
					value: {
						type: String,
						required: [
							true,
							"Recipient's email/ mobile number is required",
						],
						validate: {
							validator: (value) => {
								return (
									validator.isEmail(value) ||
									validator.isMobilePhone(value, 'en-IN')
								);
							},
							message: (props) =>
								`${props.value} is not a valid email/mobile number`,
						},
					},
				},
				{ _id: false }
			),
		],
	},
	{ timestamps: true }
);

deviceSchema.virtual('readingsCount').get(function () {
	return this.readings.length;
});

deviceSchema.virtual('recipientCount').get(function () {
	return this.recipients.length;
});

const Device = model('Device', deviceSchema);
module.exports = Device;
