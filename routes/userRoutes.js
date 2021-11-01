const { Router } = require('express');
const { updatePasswordController } = require('../controllers/userControllers');

const userRoutes = Router();

userRoutes.route('/update-password').post(updatePasswordController);

module.exports = userRoutes;
