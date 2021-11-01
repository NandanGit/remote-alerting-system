const express = require('express');
const morgan = require('morgan');
const http = require('http');
const cors = require('cors');

// Import middleware
const { verifyAdmin, verifyUser } = require('./middleware/verification');

// Import Routes
const {
	authRoutes,
	sandboxRoutes,
	userRoutes,
	deviceRoutes,
	adminRoutes,
	// dbSandboxRoutes, // Temporary routes
} = require('./routes');

// Express setup
const app = express();

// Express middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

// // Mount Routes
if (process.env.NODE_ENV !== 'production') {
	app.use('/sandbox/', sandboxRoutes);
}
app.use('/auth/', authRoutes);
app.use(verifyUser);
app.use('/user/', userRoutes);
app.use('/device/', deviceRoutes);
app.use(verifyAdmin);
app.use('/admin/', adminRoutes);

const server = http.createServer(app);

module.exports = {
	server,
	app,
};

// // SocketSetup
// require('./socketServer');
