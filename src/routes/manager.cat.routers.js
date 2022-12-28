const express = require('express');
const managerCatController = require('../controllers/manager.cat.controller.js');
const router = express.Router();

router.get('/getbreeds', managerCatController.getBreeds);
router.get('/getcolors', managerCatController.getColors);
module.exports = router;
