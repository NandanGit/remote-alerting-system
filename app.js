require('dotenv').config();

// App and server
const { app, server } = require('./serverSetup');

// connect to database
const db = require('./db/setup');
const { globalErrorHandler } = require('./middleware/errorHandling');
db.connect();

// Error handling middleware
app.use(globalErrorHandler);
