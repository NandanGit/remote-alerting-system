require('dotenv').config();
// App and server
const { app, server } = require('./serverSetup');

// connect to database
const db = require('./db/setup');
db.connect();

// Mqtt Broker
const MqttBroker = require('./mqtt-broker/setupBroker');

// Error handling middleware
const { globalErrorHandler } = require('./middleware/errorHandling');
app.use(globalErrorHandler);
