const Cat = require('../models/cat.model.js');
const fs = require('fs');

exports.addCat = async (req, res, next) => {
  const newCat = new Cat({
    name: req.body.name,
    owner: req.body.owner,
    breed: req.body.breed,
    color: req.body.color,
    sex: req.body.sex,
    age: req.body.age,
    vaccine: req.body.vaccine,
    congenitalDisease: req.body.congenitalDisease,
    natureOfParenting: req.body.natureOfParenting,
  });

  const cat = await newCat.save();

  res.send({
    _id: cat._id,
    name: cat.name,
    owner: cat.owner,
    breed: cat.breed,
    color: cat.color,
    sex: cat.sex,
    age: cat.age,
    vaccine: cat.vaccine,
    congenitalDisease: cat.congenitalDisease,
    natureOfParenting: cat.natureOfParenting,
  });
};
exports.editCat = async (req, res, next) => {
  const _id = req.body.id;
  const name = req.body.name;

  /*
    owner: req.body.owner,
    breed: req.body.breed,
    color: req.body.color,
    sex: req.body.sex,
    age: req.body.age,
    vaccine: req.body.vaccine,
    congenitalDisease: req.body.congenitalDisease,
    natureOfParenting: req.body.natureOfParenting,
    */

  const cat = await Cat.findByIdAndUpdate(_id, { name: name });

  res.send({
    _id: cat._id,
    name: cat.name,
    /* owner: cat.owner,
    breed: cat.breed,
    color: cat.color,
    sex: cat.sex,
    age: cat.age,
    vaccine: cat.vaccine,
    congenitalDisease: cat.congenitalDisease,
    natureOfParenting: cat.natureOfParenting,
  */
  });
};

exports.deleteCat = async (req, res, next) => {
  try {
    const deleteCat = await Cat.findByIdAndDelete(req.params.id);
    res.status(200).json(deleteCat);
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.match = async (req, res, next) => {
  const { catOwnerId, catTargetId } = req.body;
  //const isMatch = checkMatch(catOwnerId, catTargetId);

  //fine id cat target
  Cat.findById(catTargetId)
    .then((doc) => {
      //ก่อนเพิ่มแมวที่มาขอ
      console.log(doc.pending);
      //ตรวจสอบสัตว์เลี้ยงเคยส่งคำขอร้องหรือยัง
      let isDuplicate = true;
      doc.pending.forEach((catId) => {
        if (catId == catOwnerId) {
          res.status(401).send('duplicate request');
          isDuplicate = false;
        }
      });
      if (isDuplicate == false) return;

      //ตรวจสอยบว่าแมวตัวนี้matchกับแมวตัวอื่นยัง
      if (doc.isMatching == true) {
        res.status(401).send('the cat is matched');
        return;
      }
      const newMatch = [...doc.pending, catOwnerId];
      //หลังแมวที่มาขอ
      console.log(newMatch);
      //update new match
      Cat.findByIdAndUpdate(catTargetId, { pending: newMatch }, (err, docs) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Updated Match');
          //เพิ่มประวัติคำขอแมวให้คนขอร้อง
          Cat.findByIdAndUpdate(
            catOwnerId,
            { request: catTargetId },
            (err, doc) => {
              if (err) {
                console.log(err);
              } else {
                console.log(doc);
              }
            }
          );
          res.status(200).send('request successful');
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const checkMatch = async (catOwnerId, catTargetId) => {
  let catTargetMatchArr;
  await Cat.findById(catTargetId)
    .then((doc) => {
      catTargetMatchArr = doc.matching;
    })
    .catch((err) => {
      console.log(err);
    });

  //check
  for (let i = 0; i < catTargetMatchArr.length; i++) {
    if (catTargetMatchArr[i] === catOwnerId) {
      return true;
    }
  }

  return false;
};

exports.getCats = async (req, res, next) => {
  //return cat is don't match
  const idOwner = req.params.id;
  const query = {
    owner: { $ne: '635a42105b0629c787124ebd' },
  };
  const cats = await Cat.find(query);
  res.send(cats);
};

exports.getCat = async (req, res, next) => {
  //return cat of owner
  const idCat = req.params.id;
  const query = { _id: idCat };
  const cats = await Cat.find(query);
  res.send(cats);
};

exports.getCatOwner = async (req, res, next) => {
  //return cat of owner
  const idCat = req.params.id;
  const query = { owner: idCat };
  const cats = await Cat.find(query);
  res.send(cats);
};

exports.uploadImageCat = (req, res, next) => {
  if (req.file === 'undefined' || req.file === null) {
    return res.status(422).send('image is empty');
  }
  let file = req.file;

  return res.status(201).send({ name: file.filename });
};

exports.test = (req, res, next) => {
  var contentType = 'image/png';
  // Parsing the URL
  var request = url.parse(req.url, true);

  // Extracting the path of file
  var action = request.pathname;

  // Path Refinements
  var filePath = path.join(__dirname, action).split('%20').join(' ');
  res.writeHead(200, {
    'Content-Type': contentType,
  });
  fs.readFile(filePath, function (err, content) {
    // Serving the image
    console.log(content);
    res.end(content);
  });
};
