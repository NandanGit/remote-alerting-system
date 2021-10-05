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
					errors: { user: 'User already exists' },
				});
		}
	} else if (err.name === 'CustomError') {
		return res.status(400).json({
			success: false,
			errors: { error: err.message },
		});
	} else if (err.name === 'SyntaxError') {
		return res.status(400).json({
			success: false,
			errors: { error: 'Json format is not valid' },
		});
	}
	console.log(`Error: ${err.name}`);
	console.log(err);
	res.status(500).json({
		success: false,
		error: 'Something went wrong on our side',
	});
	// next();
};

const catchAsync = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};

module.exports = { globalErrorHandler, catchAsync };
