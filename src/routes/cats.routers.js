const express = require('express');
const catController = require('../controllers/cats.controller.js');
const router = express.Router();
const catService = require('../services/cats.services.js');

//Add Cat
//router.post('/add/cat', catController.register);
router.post(
  '/add',
  catService.uploadImage.single('image1'),
  catController.uploadImageCat
);
router.post('/cancelmatch', catController.cancelMatch);
router.post('/edit', catController.editCat);
router.post('/match', catController.match);

router.get('/', catController.getCats);
router.get('/:id', catController.getCat);
router.get('/owner/:id', catController.getCatOwner);

module.exports = router;
