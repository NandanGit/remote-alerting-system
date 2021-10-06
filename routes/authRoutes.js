const { Router } = require('express');
const {
	loginController,
	signupController,
} = require('../controllers/authControllers');

const authRoutes = Router();

authRoutes.route('/login').post(loginController);
authRoutes.route('/signup').post(signupController);

module.exports = authRoutes;
