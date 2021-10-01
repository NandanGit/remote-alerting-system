const { Schema, model } = require('mongoose');

const deviceSchema = new Schema(
	{
		deviceId: {
			type: String,
			required: [true, 'DeviceId is required'],
			unique: true,
			validate: {
				validator: (id) => {
					return /^[0-9A-F]{16}$/.test(id);
				},
				message: (props) => `${props.value} is not a valid device id`,
			},
		},
		displayName: {
			type: String,
			required: [true, 'Display Name is required'],
			validate: {
				validator: (name) => {},
				message: (props) => `${props.value} is an invalid display name`,
			},
		},
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Owner is required'],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		ranges: {
			type: Object,
			default: {},
		},
		readings: [Object],
		mailingList: [Object], // email,isVerified
		messagingList: [Object], // mobileNumber, isVerified
	},
	{ timestamps: true }
);

deviceSchema.virtual('readingsCount').get(function () {
	return this.readings.length;
});

deviceSchema.virtual('emailReceiverCount').get(function () {
	return this.mailingList.length;
});

deviceSchema.virtual('smsReceiverCount').get(function () {
	return this.messagingList.length;
});

const Device = model('Device', deviceSchema);
module.exports = Device;
