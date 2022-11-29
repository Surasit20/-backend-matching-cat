const express = require('express');
const chatController = require('../controllers/chat.controller.js');
const router = express.Router();

//get token
router.post('/signin', chatController.getToken);

module.exports = router;
