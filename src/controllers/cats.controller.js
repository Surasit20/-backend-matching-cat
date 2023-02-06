const Cat = require('../models/cat.model.js');
const fs = require('fs');
const User = require('../models/user.model.js');
const formidable = require('formidable');
const cloudinary = require('cloudinary');
//เพิ่มแมว
exports.addCat = async (req, res, next) => {
  console.log(req.body);

  try {
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
      error: '',
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
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
};

//แก้ไขแมว
exports.editCat = async (req, res, next) => {
  try {
    const location = JSON.parse(req.body.location);
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
      photo: req.body.photo,
      location: { lat: location['lat'], lng: location['lng'] },
      birthday: new Date(req.body.birthday),
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
      photo: req.body.photo,
    });
  } catch (err) {
    console.log(err);
  }
};

//ลบแมว
exports.deleteCat = async (req, res, next) => {
  console.log(req.body.idCat);
  const idOwner = req.body.idOwner;
  const idCat = req.body.idCat;
  try {
    let Cats = await Cat.find();

    for (let i = 0; i < Cats.length; i++) {
      if (Cats[i]['accept'] == idCat) {
        await Cat.findByIdAndUpdate(Cats[i]['_id'], { accept: '' });
      }
      if (Cats[i]['request'] == idCat) {
        await Cat.findByIdAndUpdate(Cats[i]['_id'], { request: '' });
      }

      for (let j = 0; j < Cats[i]['pending'].length; j++) {
        if (Cats[i]['pending'][j] == idCat) {
          let newPending = Cats[i]['pending'].filter((val) => val != idCat);

          await Cat.findByIdAndUpdate(Cats[i]['_id'], {
            pending: newPending,
          });
        }
      }
    }

    const deleteCat = await Cat.findByIdAndDelete(idCat);
    //console.log(deleteCat);
    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};

//ส่งคำขอร้องผสมพันธุ์
exports.request = async (req, res, next) => {
  const { catOwnerId, catTargetId } = req.body;
  //const isMatch = checkMatch(catOwnerId, catTargetId);

  //fine id cat target
  Cat.findById(catTargetId)
    .then(async (doc) => {
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

      //ตรวจสอบว่าแมวตัวนี้matchกับแมวตัวอื่นยัง
      if (doc.accept != '' && doc.accept != null) {
        res.send({ error: 'the cat is matched' });
        return;
      }

      //เวลาปัจุบัน
      let date_ob = new Date();
      let currentDate = new Date().toJSON().slice(0, 10);
      console.log(currentDate); // "2022-06-17"
      let year = date_ob.getFullYear();

      // current hours
      let hours = date_ob.getHours();

      // current minutes
      let minutes = date_ob.getMinutes();

      //แจ้งเตือน
      let notification = {
        subject: 'มีแมวส่งคำร้องผสมพันธ์กับ' + doc.name,
        content:
          'เวลาที่ส่งคำร้องขอ ' +
          currentDate +
          ' ' +
          hours +
          ':' +
          minutes +
          ' น.',
        read: false,
      };
      console.log(doc.owner);
      await User.findById(doc.owner).then(async (user) => {
        let tempnNotification = user.notification;
        await User.findByIdAndUpdate(doc.owner, {
          notification: [notification, ...tempnNotification],
        });
      });
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
    .then(async (doc) => {
      console.log(doc.pending);

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

      //เวลาปัจุบัน
      let currentDate = new Date().toJSON().slice(0, 10);
      console.log(currentDate); // "2022-06-17"

      //แจ้งเตือน
      let notification = {
        subject: doc.name + 'ได้จับคู่แล้ว',
        content: 'เวลาที่ส่งคำร้องขอ' + currentDate,
        read: false,
      };
      console.log(doc.owner);
      await User.findById(doc.owner).then(async (user) => {
        let tempnNotification = user.notification;
        await User.findByIdAndUpdate(doc.owner, {
          notification: [notification, ...tempnNotification],
        });
      });
      Cat.findByIdAndUpdate(
        catOwnerId,
        { pending: newMatch, isMatching: true, accept: catTargetId },
        (err, docs) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated Match');

            Cat.findByIdAndUpdate(
              catTargetId,
              { accept: catOwnerId, isMatching: true, pending: [] },
              async (err, doc) => {
                if (err) {
                  console.log(err);
                } else {
                  //แจ้งเตือน
                  let notification = {
                    subject: doc.name + 'ได้จับคู่แล้ว',
                    content: 'เวลาที่ส่งคำร้องขอ' + currentDate,
                    read: false,
                  };
                  console.log(doc.owner);
                  await User.findById(doc.owner).then(async (user) => {
                    let tempnNotification = user.notification;
                    await User.findByIdAndUpdate(doc.owner, {
                      notification: [notification, ...tempnNotification],
                    });
                  });
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
    //console.log(typeof cats);
    let catData = [];

    for (let i = 0; i < cats.length; i++) {
      // get data cat
      let Difference_In_Time = Date.now() - cats[i].birthday.getTime();
      let age = parseInt(Difference_In_Time / (1000 * 3600 * 24));
      console.log(age);
      cats[i] = { ...cats[i]._doc, age: age };

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

    //console.log(cats);
    res.send(cats);
  } catch (err) {
    console.log(err.message);
  }
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
                async (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    // console.log(doc);
                    //เวลาปัจุบัน
                    let date_ob = new Date();
                    let currentDate = new Date().toJSON().slice(0, 10);
                    console.log(currentDate); // "2022-06-17"
                    let year = date_ob.getFullYear();

                    // current hours
                    let hours = date_ob.getHours();

                    // current minutes
                    let minutes = date_ob.getMinutes();

                    // prints date in YYYY-MM-DD format

                    //แจ้งเตือน
                    let notification = {
                      subject: doc.name + 'ได้ถูกยกเลิกจับคู่',
                      content:
                        'เวลาที่ยกเลิกจับคู่ ' +
                        currentDate +
                        ' ' +
                        hours +
                        ':' +
                        minutes +
                        ' น.',
                      read: false,
                    };
                    console.log(doc.owner);
                    await User.findById(doc.owner).then(async (user) => {
                      let tempnNotification = user.notification;
                      await User.findByIdAndUpdate(doc.owner, {
                        notification: [notification, ...tempnNotification],
                      });
                    });
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
/*
const cloudinary = require('cloudinary').v2;
const Formidable = require('formidable');
const util = require('util');
*/
exports.uploadImageCat1 = (req, res, next) => {
  try {
    console.log(req.body);

    const util = require('util');

    const form = formidable({ multiples: true });
    // Configuration
    cloudinary.config({
      cloud_name: 'dx59hbzcc',
      api_key: '855424797956667',
      api_secret: 'DMZow5_WOC1z44VCDW0ZkPtHTAs',
    });

    // Upload
    form.parse(req, (err, fields, files) => {
      console.log(req.body);
      console.log(files.files.filepath);
      //https://cloudinary.com/documentation/upload_images
      cloudinary.uploader.upload(files.files.filepath, (result) => {
        console.log(result);
        if (result.public_id) {
          res.writeHead(200, { 'content-type': 'text/plain' });

          res.end(util.inspect(result.url));
        }
      });
    });
    return;
  } catch (err) {}
};
