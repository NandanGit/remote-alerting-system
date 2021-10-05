module.exports = {
	authRoutes: require('./authRoutes'),
	userRoutes: require('./userRoutes'),
	deviceRoutes: require('./deviceRoutes'),
	sandboxRoutes:
		process.env.NODE_ENV !== 'production'
			? require('./routes.sandbox')
			: undefined,
};
