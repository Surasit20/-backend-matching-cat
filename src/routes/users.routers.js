const express = require('express');
const userController = require('../controllers/users.controller.js');
const router = express.Router();

router.get('/get/:id', userController.getUser);
//Register
router.post('/register', userController.register);

//Login
router.post('/login', userController.login);

//router.post('/reset', userController.createTokenResetPassword);

router.post('/edit', userController.editUser);

router.post('/changePassword', userController.changePasswordUser);

module.exports = router;
