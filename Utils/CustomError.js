class CustomError extends Error {
	constructor(message, type = 'error') {
		super(message);
		this.name = 'CustomError';
		this.type = type;
	}
}

module.exports = CustomError;
