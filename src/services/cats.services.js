const multer = require('multer');
const Cat = require('../models/cat.model.js');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file.originalname);
    console.log('ดเกดเ');
    cb(null, __dirname + '/../uploads/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

exports.uploadImage = multer({ storage: storage });

exports.stableMatching = async (req, res, next) => {
  // get parameters
  try {
    const idCat = req.body.idCat;
    const queryOwner = { _id: idCat };
    const ownerCat = await Cat.find(queryOwner);
    const queryAllCats = { owner: { $ne: ownerCat[0].owner }, accept: '' };
    const cats = await Cat.find(queryAllCats);

    // find OppositeSex of owner cat
    let catOppositeSex = cats.filter((cat) => {
      return cat.sex != ownerCat[0].sex;
    });

    let rating1 = [];
    let rating2 = [];
    let ratingLow = [];

    console.log(ownerCat[0].birthday.getTime());
    const interestedOwnerCat = ownerCat[0].interested;
    for (let i = 0; i < catOppositeSex.length; ++i) {
      //get age
      let Difference_In_Time =
        Date.now() - catOppositeSex[i].birthday.getTime();
      catOppositeSex[i].age = parseInt(Difference_In_Time / (1000 * 3600 * 24));
      catOppositeSex[i] = {
        ...catOppositeSex[i]._doc,
        age: parseInt(Difference_In_Time / (1000 * 3600 * 24)),
      };

      console.log(parseInt(Difference_In_Time / (1000 * 3600 * 24)));
      //count the number of interested

      let point = 0;
      // console.log(catOppositeSex[i].interested);
      // stable matching
      if (
        interestedOwnerCat.breed == catOppositeSex[i].breed &&
        catOppositeSex[i].interested.breed == ownerCat[0].breed &&
        interestedOwnerCat.color == catOppositeSex[i].color &&
        catOppositeSex[i].interested.color == ownerCat[0].color
      ) {
        point++;
      }
      if (
        interestedOwnerCat.color == catOppositeSex[i].color &&
        catOppositeSex[i].interested.color == ownerCat[0].color
      ) {
        point++;
      }
      //console.log(point + '---' + catOppositeSex[i].name);

      // ranking
      if (point == 2) {
        rating1.push(catOppositeSex[i]);
      } else if (point == 1) {
        rating2.push(catOppositeSex[i]);
      } else {
        ratingLow.push(catOppositeSex[i]);
      }
    }
    console.log(rating1);
    const result = [
      ...rating1,
      ...rating2,
      ...ratingLow,
      { message: 'คุณเลือกแมวแล้ว' },
    ];

    //console.log(result);
    res.send(result);
  } catch (e) {
    res.send({ message: 'คุณยังไม่ได้เลือกแมว' });
  }
};
