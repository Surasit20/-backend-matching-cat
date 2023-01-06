const express = require('express');
const catController = require('../controllers/cats.controller.js');
const router = express.Router();
const catService = require('../services/cats.services.js');

//Add Cat
//router.post('/add/cat', catController.register);
router.post(
  '/uploadImage',
  catService.uploadImage.single('image1'),
  catController.uploadImageCat
);
router.post('/add', catController.addCat);
router.post('/cancel/pending', catController.cancelPending);
router.post('/cancel/request', catController.cancelRequest);
router.post('/cancel/accept', catController.cancelAccept);
router.patch('/edit', catController.editCat);
router.post('/request', catController.request);
router.post('/accept', catController.accept);
router.post('/delete', catController.deleteCat);
//router.get('/', catController.getCats);
router.get('/:id', catController.getCats);
router.get('/owner/:id', catController.getCatOwner);
router.post('/stablematching', catService.stableMatching);
router.post('/interested', catController.setInterested);

//router.post('/cancel', catController.cancelRequest);

module.exports = router;
