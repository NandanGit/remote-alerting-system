const express = require('express');
const morgan = require('morgan');
const http = require('http');
const cors = require('cors');

// Import Routes
const {
	authRoutes,
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
app.use('/', authRoutes);

const server = http.createServer(app);

module.exports = {
	server,
	app,
};

// // SocketSetup
// require('./socketServer');
