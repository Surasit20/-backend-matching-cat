const express = require('express');
const managerCatController = require('../controllers/manager.cat.controller.js');
const router = express.Router();
/*
router.get('/getbreeds', managerCatController.getBreeds);
router.get('/getcolors', managerCatController.getColors);
*/
//report
router.get('/report/cat', managerCatController.getCatReport);
router.get('/report/user', managerCatController.getUserReport);

module.exports = router;
