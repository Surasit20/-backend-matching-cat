const express = require('express');
const userController = require('../controllers/users.controller.js');
const router = express.Router();

//Register
router.post('/register', userController.register);

//Login
router.post('/login', userController.login);

module.exports = router;
