const { Router } = require('express');
const {
	loginController,
	signupController,
	verifyAccountController,
} = require('../controllers/authControllers');

const authRoutes = Router();

authRoutes.route('/login').post(loginController);
authRoutes.route('/signup').post(signupController);
authRoutes.route('/verify-account/:token').get(verifyAccountController);

module.exports = authRoutes;
