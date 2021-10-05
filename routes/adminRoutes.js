const { Router } = require('express');
const { addDeviceController } = require('../controllers/adminControllers');

const adminRoutes = Router();

adminRoutes.route('/add-device').post(addDeviceController);

module.exports = adminRoutes;
