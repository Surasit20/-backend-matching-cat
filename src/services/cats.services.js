const multer = require('multer');
const Cat = require('../models/cat.model.js');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(file.originalname);
    //console.log('ดเกดเ');
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

    let rating100 = [];
    let rating80 = [];
    let rating60 = [];
    let rating40 = [];
    let rating20 = [];
    let ratingRandom = [];

    //console.log(ownerCat[0].birthday.getTime());
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

      //console.log(parseInt(Difference_In_Time / (1000 * 3600 * 24)));
      //count the number of interested

      let point = 0;
      // console.log(catOppositeSex[i].interested);
      // stable matching
      if (
        interestedOwnerCat.breed == catOppositeSex[i].breed &&
        catOppositeSex[i].interested.breed == ownerCat[0].breed &&
        interestedOwnerCat.breed != undefined
      ) {
        point += 40;
        console.log('ยยย');
      }
      console.log(catOppositeSex[i].color);
      if (
        interestedOwnerCat.color == catOppositeSex[i].color &&
        catOppositeSex[i].interested.color == ownerCat[0].color &&
        interestedOwnerCat.color != undefined
      ) {
        point += 20;
        console.log('เเเ');
      }

      //console.log(interestedOwnerCat.feedSystem);
      if (
        interestedOwnerCat.feedSystem == catOppositeSex[i].feedSystem &&
        catOppositeSex[i].interested.feedSystem == ownerCat[0].feedSystem &&
        interestedOwnerCat.feedSystem != undefined
      ) {
        point += 20;
      }

      try {
        let isVaccineOwner =
          interestedOwnerCat.vaccine.includes('ยังไม่ได้รับวัคซีน');
        let isVaccineOpposite =
          catOppositeSex[i].vaccine[0].includes('ยังไม่ได้รับวัคซีน');

        let isVaccineOwnerInterested =
          interestedOwnerCat.vaccine.includes('ยังไม่ได้รับวัคซีน');
        let isVaccineOppositeInterested =
          catOppositeSex[i].vaccine[0].includes('ยังไม่ได้รับวัคซีน');

        if (
          isVaccineOwner == isVaccineOpposite &&
          isVaccineOwnerInterested == isVaccineOppositeInterested
        ) {
          console.log('ฟฟ');
          point += 20;
        }
      } catch (e) {
        console.log(e);
      }
      //point = 100;
      console.log(point + '---' + catOppositeSex[i].name);

      catOppositeSex[i].probability = point;
      // ranking
      if (point == 100) {
        rating100.push(catOppositeSex[i]);
      } else if (point == 80) {
        rating80.push(catOppositeSex[i]);
      } else if (point == 60) {
        rating60.push(catOppositeSex[i]);
      } else if (point == 40) {
        rating40.push(catOppositeSex[i]);
      } else if (point == 20) {
        rating20.push(catOppositeSex[i]);
      } else {
        ratingRandom.push(catOppositeSex[i]);
      }
    }
    //console.log(rating1);
    const result = [
      ...rating100,
      ...rating80,
      ...rating60,
      ...rating40,
      ...rating20,
      ...ratingRandom,
      { message: 'คุณเลือกแมวแล้ว', probability: '' },
    ];

    //console.log(result);
    res.send(result);
  } catch (e) {
    console.log(e);
    res.send({ message: 'คุณยังไม่ได้เลือกแมว' });
  }
};
