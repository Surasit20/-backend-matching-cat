const Cat = require('../models/cat.model.js');
const fs = require('fs');

//เพิ่มแมว
exports.addCat = async (req, res, next) => {
  const location = JSON.parse(req.body.location);
  const newCat = new Cat({
    name: req.body.name,
    owner: req.body.owner,
    breed: req.body.breed,
    color: req.body.color,
    sex: req.body.sex,
    birthday: new Date(req.body.birthday),
    vaccine: req.body.vaccine,
    congenitalDisease: req.body.congenitalDisease,
    natureOfParenting: req.body.natureOfParenting,
    photo: req.body.photo,
    address: req.body.address,
    location: { lat: location['lat'], lng: location['lng'] },
  });

  const cat = await newCat.save();

  res.send({
    _id: cat._id,
    name: cat.name,
    owner: cat.owner,
    breed: cat.breed,
    color: cat.color,
    sex: cat.sex,
    birthday: cat.birthday,
    vaccine: cat.vaccine,
    congenitalDisease: cat.congenitalDisease,
    natureOfParenting: cat.natureOfParenting,
    photo: cat.photo,
  });
};

//แก้ไขแมว
exports.editCat = async (req, res, next) => {
  const cat = await Cat.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    owner: req.body.owner,
    age: req.body.age,
    breed: req.body.breed,
    color: req.body.color,
    sex: req.body.sex,
    vaccine: req.body.vaccine,
    congenitalDisease: req.body.congenitalDisease,
    natureOfParenting: req.body.natureOfParenting,
  });

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

//ลบแมว
exports.deleteCat = async (req, res, next) => {
  console.log(req.body.idCat);
  const idOwner = req.body.idOwner;
  const idCat = req.body.idCat;
  try {
    const deleteCat = await Cat.findByIdAndDelete(idCat);
    res.status(200).json(deleteCat);
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.deleteCat = async (req, res, next) => {
  console.log(req.body.idCat);
  const idOwner = req.body.idOwner;
  const idCat = req.body.idCat;
  try {
    const deleteCat = await Cat.findByIdAndDelete(idCat);
    res.status(200).json(deleteCat);
  } catch (error) {
    res.status(404).json(error);
  }
};

// ส่งคำขอร้องผสมพันธุ์
exports.request = async (req, res, next) => {
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
          res.send({ error: 'duplicate request' });
          isDuplicate = false;
        }
      });
      if (isDuplicate == false) return;

      //ตรวจสอยบว่าแมวตัวนี้matchกับแมวตัวอื่นยัง
      if (doc.accept != '' && doc.accept != null) {
        res.send({ error: 'the cat is matched' });
        return;
      }
      console.log('สำเร็จ');
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
          console.log('สำเร็จ');
          res.send({ message: 'request successful', error: '' });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
// ยอมรับ
exports.accept = async (req, res, next) => {
  const { catOwnerId, catTargetId } = req.body;
  console.log(catOwnerId, catTargetId);
  //const isMatch = checkMatch(catOwnerId, catTargetId);

  //fine id cat target
  Cat.findById(catOwnerId)
    .then((doc) => {
      //ก่อนเพิ่มแมวที่มาขอ
      console.log(doc.pending);
      //ตรวจสอบสัตว์เลี้ยงเคยส่งคำขอร้องของเรา
      let isDuplicate = true;

      doc.pending.forEach((catId) => {
        if (catId != catTargetId) {
          res.send({ error: 'no request' });
          isDuplicate = false;
        }
      });
      if (isDuplicate == false) return;

      //ตรวจสอยบว่าแมวตัวนี้matchกับแมวตัวอื่นยัง
      if (doc.accept != '' && doc.accept != null) {
        res.send({ error: 'the cat is matched' });
        return;
      }

      console.log('สำเร็จ');
      const newMatch = [];
      //หลังแมวที่มาขอ
      console.log(newMatch);
      //update new match
      Cat.findByIdAndUpdate(
        catOwnerId,
        { pending: newMatch, isMatching: true, accept: catTargetId },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated Match');
            //เพิ่มประวัติคำขอแมวให้คนขอร้อง
            Cat.findByIdAndUpdate(
              catTargetId,
              { accept: catOwnerId, isMatching: true, pending: [] },
              (err, doc) => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(doc);
                }
              }
            );
            console.log('สำเร็จ');
            res.send({ message: 'request successful', error: '' });
          }
        }
      );
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
//ดึงข้อมูลแมว ทั้งหมด
exports.getCats = async (req, res, next) => {
  //return cat is don't match

  const idOwner = req.params.id;
  const query = {
    owner: { $ne: idOwner },
  };

  const cats = await Cat.find(query);
  //console.log(cats);
  //console.log(idOwner);
  res.send(cats);
};
// บันทึกความสนใจแมว
exports.setInterested = async (req, res, next) => {
  //return cat of owner
  const idCat = req.body.idCat;
  const breed = req.body.breed;
  const color = req.body.color;
  console.log(req.body);
  Cat.findByIdAndUpdate(
    idCat,
    { interested: { breed: breed, color: color } },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        ///console.log('Updated interested cat : ', docs);
        res.send(docs);
      }
    }
  );
};
//ดึงข้อมูลแมว 1 ตัว
exports.getCat = async (req, res, next) => {
  //return cat of owner
  const idCat = req.params.id;
  const query = { _id: idCat };
  const cats = await Cat.find(query);

  res.send(cats);
};
//ดึงข้อมูลเจ้าของแมว
exports.getCatOwner = async (req, res, next) => {
  //return cat of owner
  try {
    const idOwner = req.params.id;
    const query = { owner: idOwner };

    let cats = await Cat.find(query);
    let cats1 = await Cat.find();
    console.log(typeof cats);
    let catData = [];

    for (let i = 0; i < cats.length; i++) {
      // get data cat

      if (cats[i].request != '' && cats[i].request != null) {
        const query = { _id: cats[i].request };
        const cat = await Cat.find(query);
        if (cats[i]._doc == null) {
          cats[i] = { ...cats[i], requestDataCat: cat };
        } else {
          cats[i] = { ...cats[i]._doc, requestDataCat: cat };
        }
      }
      if (cats[i].accept != '' && cats[i].accept != null) {
        const query = { _id: cats[i].accept };
        const cat = await Cat.find(query);

        if (cats[i]._doc == null) {
          cats[i] = { ...cats[i], acceptDataCat: cat };
        } else {
          cats[i] = { ...cats[i]._doc, acceptDataCat: cat };
        }
      }

      let pendingDataCatArr = [];
      if (cats[i].pending != [] && cats[i].pending != null) {
        for (let j = 0; j < cats[i].pending.length; j++) {
          const query = { _id: cats[i].pending[j] };
          const cat = await Cat.find(query);
          pendingDataCatArr.push(cat);
        }
        if (cats[i]._doc == null) {
          cats[i] = { ...cats[i], pendingDataCat: pendingDataCatArr };
        } else {
          cats[i] = { ...cats[i]._doc, pendingDataCat: pendingDataCatArr };
        }
        //console.log(cats[i]);
      }
    }
    console.log(typeof cats);
    res.send(cats);
  } catch (err) {
    console.log(err.message);
  }
};

//อัพโหลดรูปภาพ
exports.uploadImageCat = (req, res, next) => {
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

exports.cancelRequest = async (req, res, next) => {
  const { catOwnerId, catTargetId } = req.body;
  //const isMatch = checkMatch(catOwnerId, catTargetId);

  //fine id cat target
  Cat.findById(catTargetId)
    .then((doc) => {
      //ก่อนเพิ่มแมวที่มาขอ
      console.log(doc.pending);
      console.log(catOwnerId);
      //ตรวจสอบสัตว์เลี้ยงเคยส่งคำขอร้องหรือยัง
      let isExist = true;
      let historyCancel = [...doc.historyCancel, String(catTargetId)];
      if (doc.pending.indexOf(catOwnerId) == -1) {
        res.send('your cat do not exist');
        isExist = false;
      }
      if (isExist == false) return;
      //ลบคำขอแมว
      doc.pending = doc.pending.filter((item) => {
        return item !== catOwnerId;
      });
      //update new match
      Cat.findByIdAndUpdate(
        catTargetId,
        { pending: doc.pending },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated Match');
            //ลบประวัติคำขอแมวให้คนขอร้อง
            Cat.findByIdAndUpdate(
              catOwnerId,
              { request: '', historyCancel: historyCancel },
              (err, doc) => {
                if (err) {
                  console.log(err);
                } else {
                  // console.log(doc);
                }
              }
            );
            res.send({ message: 'Cancel Request Successful', error: '' });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.cancelPending = async (req, res, next) => {
  const { catOwnerId, catTargetId } = req.body;
  //const isMatch = checkMatch(catOwnerId, catTargetId);
  //fine id cat target
  try {
    Cat.findById(catOwnerId)
      .then((doc) => {
        //ก่อนเพิ่มแมวที่มาขอ

        console.log(catOwnerId);
        //ตรวจสอบสัตว์เลี้ยงเคยส่งคำขอร้องหรือยัง
        let isExist = true;
        let historyCancel = [...doc.historyCancel, String(catTargetId)];
        console.log(historyCancel);
        if (doc.pending.indexOf(catTargetId) == -1) {
          res.send('your cat do not exist');
          isExist = false;
        }

        if (isExist == false) return;
        //ปฏิเสธแมว
        doc.pending = doc.pending.filter((item) => {
          return item !== catTargetId;
        });
        //update new match
        Cat.findByIdAndUpdate(
          catOwnerId,
          { pending: doc.pending, historyCancel: historyCancel },
          (err, docs) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Updated Cancel Accept');
              //ลบประวัติคำขอแมวให้คนขอร้อง
              Cat.findByIdAndUpdate(
                catTargetId,
                { request: '' },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    // console.log(doc);
                  }
                }
              );

              res.send({ message: 'Cancel Accept successful', error: '' });
            }
          }
        );
      })
      .catch((err) => {
        res.send({ message: 'your cat do not exist', error: err.message });
      });
  } catch (err) {
    res.send({ message: err.message });
  }
};

exports.cancelAccept = async (req, res, next) => {
  const { catOwnerId, catTargetId } = req.body;
  //const isMatch = checkMatch(catOwnerId, catTargetId);
  //fine id cat target
  try {
    Cat.findById(catOwnerId)
      .then((doc) => {
        //ก่อนเพิ่มแมวที่มาขอ

        console.log(catOwnerId);
        //ตรวจสอบสัตว์เลี้ยงเคยส่งคำขอร้องหรือยัง
        let isExist = true;
        let historyCancel = [...doc.historyCancel, String(catTargetId)];
        console.log(historyCancel);

        //หาผู้ขอหรือผู้ถูกขอ
        let status;
        if (doc.accept == null || doc.request == null) {
          res.send('your cat do not exist');
          isExist = false;
        }

        if (isExist == false) return;
        //ปฏิเสธแมว
        doc.pending = doc.pending.filter((item) => {
          return item !== catTargetId;
        });
        //update new match
        Cat.findByIdAndUpdate(
          catOwnerId,
          { pending: doc.pending, historyCancel: historyCancel, accept: '' },
          (err, docs) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Updated Cancel Accept');
              //ลบประวัติคำขอแมวให้คนขอร้อง
              Cat.findByIdAndUpdate(
                catTargetId,
                { request: '', accept: '' },
                (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    // console.log(doc);
                  }
                }
              );

              res.send({ message: 'Cancel Accept successful', error: '' });
            }
          }
        );
      })
      .catch((err) => {
        res.send({ message: 'your cat do not exist', error: err.message });
      });
  } catch (err) {
    res.send({ message: err.message });
  }
};
