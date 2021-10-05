const { Router } = require('express');
const {
	addDeviceController,
	removeDeviceController,
	updateDeviceController,
} = require('../controllers/deviceControllers');

const deviceRoutes = Router();

deviceRoutes.route('/add').post(addDeviceController);
deviceRoutes.route('/remove').post(removeDeviceController);
deviceRoutes.route('/update').post(updateDeviceController);

module.exports = deviceRoutes;
