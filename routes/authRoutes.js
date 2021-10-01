const { Router } = require('express');
const {
	loginController,
	signupController,
	updatePasswordController,
} = require('../controllers/authControllers');

const authRoutes = Router();

authRoutes.route('/login').post(loginController);
authRoutes.route('/signup').post(signupController);
authRoutes.route('/update-password').post(updatePasswordController);

module.exports = authRoutes;
