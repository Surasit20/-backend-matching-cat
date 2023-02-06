app.post('/uploadImage', uploadImage.single('image1'), uploadImageCat);

const multer = require('multer');
const Cat = require('../models/cat.model.js');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, __dirname + '/../uploads/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

uploadImage = multer({ storage: storage });

const uploadImageCat = (req, res, next) => {
  if (req.file === 'undefined' || req.file === null) {
    return res.status(422).send('image is empty');
  }
  let file = req.file;
  //console.log(file);
  //console.log(req.body);
  return res
    .status(201)
    .send({ name: `http://10.10.10.150:3030/images/${file.filename}` });
};
