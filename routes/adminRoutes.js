const { Router } = require('express');
const { createDeviceController } = require('../controllers/adminControllers');

const adminRoutes = Router();

adminRoutes.route('/create-device').post(createDeviceController);

module.exports = adminRoutes;
