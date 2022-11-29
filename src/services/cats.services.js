const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, __dirname + '/../uploads/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

exports.uploadImage = multer({ storage: storage });
