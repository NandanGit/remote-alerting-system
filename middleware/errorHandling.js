const globalErrorHandler = async (err, req, res, next) => {
	if (err.name === 'ValidationError') {
		for (e in err.errors) {
			err.errors[e] = err.errors[e].message;
		}
		// console.log(err.errors);
		return res.status(400).json({
			success: false,
			errors: err.errors,
		});
	} else if (err.name === 'MongoServerError') {
		switch (err.code) {
			case 11000:
				return res.status(400).json({
					success: false,
					errors: { duplicate: 'Entity already exists' },
				});
		}
	} else if (err.name === 'CustomError') {
		const errors = {};
		errors[err.type] = err.message;
		return res.status(400).json({
			success: false,
			errors,
		});
	} else if (err.name === 'SyntaxError') {
		return res.status(400).json({
			success: false,
			errors: { SyntaxError: 'Json format is not valid' },
		});
	} else if (err.name === 'JsonWebTokenError') {
		return res.status(400).json({
			success: false,
			errors: { JsonWebTokenError: err.message },
		});
	}
	console.log(`Error   : ${err.name}\nMessage : ${err.message}`);
	console.log(err);
	res.status(500).json({
		success: false,
		errors: { ServerError: 'Something went wrong on our side' },
	});
	// next();
};

const catchAsync = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};

const generalErrorHandler = async (err) => {
	if (err.name === 'ValidationError') {
		for (e in err.errors) {
			err.errors[e] = err.errors[e].message;
		}
		return console.log(err.errors);
	} else if (err.name === 'MongoServerError') {
		switch (err.code) {
			case 11000:
				return console.log('Error: Entity already exists');
		}
	} else if (err.name === 'CustomError') {
		return console.log(`General Error: ${err.type} --> ${err.message}`);
	} else if (err.name === 'SyntaxError') {
		return console.log('Error: Json format is not valid');
	} else if (err.name === 'JsonWebTokenError') {
		console.log('Error: JsonWebTokenError');
	}

	console.log('General Error Handler: Something went south!!!');
	console.log(`Error   : ${err.name}\nMessage : ${err.message}`);
	console.log(err);
};

const catchGeneralAsync = (fn) => {
	return (...args) => {
		fn(...args).catch(generalErrorHandler);
	};
};

module.exports = {
	globalErrorHandler,
	catchAsync,
	catchGeneralAsync,
	generalErrorHandler,
};
