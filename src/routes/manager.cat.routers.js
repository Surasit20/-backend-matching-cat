const express = require('express');
const managerCatController = require('../controllers/manager.cat.controller.js');
const notificationController = require('../services/notification.services.js');
const router = express.Router();
/*
router.get('/getbreeds', managerCatController.getBreeds);
router.get('/getcolors', managerCatController.getColors);
*/
//report
router.get('/report/cat', managerCatController.getCatReport);
router.get('/report/users', managerCatController.getUserReport);
router.delete('/delete/users', managerCatController.deleteUser);
router.post('/notify', managerCatController.getNotifications);
router.post('/sendSurvey', managerCatController.sendSurvey);
router.delete('/deletenotify', managerCatController.deleteNotifications);
router.get('/survey', managerCatController.getSurvey);

router.post('/sendNotification', managerCatController.getSurvey);
router.post('/reportCat', managerCatController.reportCat);
router.get('/getReportCat', managerCatController.getReportCat);
module.exports = router;
