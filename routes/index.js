module.exports = {
	authRoutes: require('./authRoutes'),
	userRoutes: require('./userRoutes'),
	deviceRoutes: require('./deviceRoutes'),
	adminRoutes: require('./adminRoutes'),
	sandboxRoutes:
		process.env.NODE_ENV !== 'production'
			? require('./routes.sandbox')
			: undefined,
};
