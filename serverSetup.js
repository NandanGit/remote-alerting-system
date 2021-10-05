const express = require('express');
const morgan = require('morgan');
const http = require('http');
const cors = require('cors');

// Import Routes
const {
	authRoutes,
	sandboxRoutes,
	userRoutes,
	deviceRoutes,
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
app.use('/auth/', authRoutes);
app.use('/user/', userRoutes);
app.use('/device/', deviceRoutes);
if (process.env.NODE_ENV !== 'production') {
	app.use('/sandbox/', sandboxRoutes);
}

const server = http.createServer(app);

module.exports = {
	server,
	app,
};

// // SocketSetup
// require('./socketServer');
