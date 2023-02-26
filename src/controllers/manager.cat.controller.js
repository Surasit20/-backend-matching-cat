const { query } = require('express');
const Cat = require('../models/cat.model.js');
const User = require('../models/user.model.js');
exports.getBreeds = async (req, res, next) => {
  const managerCats = await ManagerCat.find();

  res.send(managerCats[0]['breeds']);
};

exports.getColors = async (req, res, next) => {
  const managerCats = await ManagerCat.find();

  res.send(managerCats[0]['colors']);
};

exports.getCatReport = async (req, res, next) => {
  let report = {
    totalAllCat: 0,
    totalMenCat: 0,
    totalWomenCat: 0,
    totalMatchedCat: 0,
    totalUnMatchedCat: 0,
    totalRequestCat: 0,
    totalPendingCat: 0,
    totalUnmatchCat: 0,
  };
  let breed = {
    สายพันธุ์เอเซียนกึ่งขนยาว: 0,
    สายพันธุ์บาลิเนส: 0,
    สายพันธุ์เบอร์แมน: 0,
    สายพันธุ์อะบิสซิเนียน: 0,
    สายพันธุ์บริติชขนสั้น: 0,
    สายพันธุ์บชาร์ตรู: 0,
    สายพันธุ์สฟิงซ์: 0,
    สายพันธุ์มันซ์กิ้น: 0,
    สายพันธุ์คอร์นิซเรกซ์: 0,
    สายพันธุ์เบงกอล: 0,
    สายพันธุ์ชีโต: 0,
    สายพันธุ์แมวพันธุ์ทอยเกอร์: 0,
  };

  const Cats = await Cat.find();

  Cats.forEach((element) => {
    report.totalAllCat += 1;

    //count sex
    if (element.sex == 'ผู้') {
      report.totalMenCat += 1;
    } else {
      report.totalWomenCat += 1;
    }

    //count matched
    if (element.isMatching == true) {
      report.totalMatchedCat += 1;
    } else {
      report.totalUnMatchedCat += 1;
    }

    //count
    if (element.RequestCat != '') {
      report.totalRequestCat += 1;
    }
    breed[element.breed] += 1;
  });

  report.breed = breed;

  res.send(report);
};

exports.getUserReport = async (req, res, next) => {
  const Users = await User.find();
  res.send(Users);
};

exports.deleteUser = async (req, res, next) => {
  try {
    const Users = await User.findByIdAndDelete(req.body.id);
    //await Cat.findByIdAndDelete(req.body.id, { owner: req.body.id });

    let Cats = await Cat.find();
    let CatsOwner = await Cat.find({ owner: req.body.id });
    console.log(CatsOwner[0]._id.toString());

    for (let j = 0; j < CatsOwner.length; j++) {
      await Cat.findByIdAndDelete(CatsOwner[j]._id.toString());
      for (let i = 0; i < Cats.length; i++) {
        if (Cats[i]['accept'] == CatsOwner[j]._id.toString()) {
          await Cat.findByIdAndUpdate(Cats[i], { accept: '' });
        }
        if (Cats[i]['request'] == CatsOwner[j]._id.toString()) {
          await Cat.findByIdAndUpdate(Cats[i]), { request: '' };
        }

        for (let j = 0; j < Cats[i]['pending'].length; j++) {
          if (Cats[i]['pending'][j] == CatsOwner[j]._id.toString()) {
            let newPending = Cats[i]['pending'].filter(
              (val) => val != CatsOwner[j]._id.toString()
            );

            await Cat.findByIdAndUpdate(Cats[i], {
              pending: newPending,
            });
          }
        }
      }
    }
    //console.log(Users);
    res.send({ Users });
  } catch (err) {
    res.send({ message: err.message });
  }
};
//แจ้งเตือน
exports.getNotifications = async (req, res, next) => {
  const query = { _id: req.body.id };
  const user = await User.find(query);
  res.send(user[0].notification);
};

exports.deleteNotifications = async (req, res, next) => {
  try {
    const query = { _id: req.body.id };
    const user = await User.find(query);

    let notification = user[0].notification;
    const result = notification.filter((val, i) => i != req.body.index);
    //console.log(result);
    const resUser = await User.findByIdAndUpdate(
      req.body.id,
      {
        notification: result,
      },
      { returnOriginal: false }
    );

    res.send(resUser.notification);
  } catch (err) {
    res.send({ message: err.message });
  }
};

exports.sendSurvey = async (req, res, next) => {
  try {
    // const query = { _id: req.body.id };
    //const user = await User.find(query);

    await User.findByIdAndUpdate(req.body.id, {
      survey: {
        ratting: req.body.ratting,
        suggestion: req.body.suggestion,
        name: req.body.name,
      },
    });
    res.send({ message: 'success' });
  } catch (err) {
    res.send({ message: err.message });
  }
};

exports.getSurvey = async (req, res, next) => {
  let ratting = {
    '1.0': 0,
    1.5: 0,
    '2.0': 0,
    2.5: 0,
    '3.0': 0,
    3.5: 0,
    '4.0': 0,
    4.5: 0,
    '5.0': 0,
  };

  let rattingAvg = 0;
  let rattingCount = 0;
  let survey = [];
  try {
    const users = await User.find();

    users.forEach((user) => {
      if (user.survey) {
        if (user.survey.suggestion != '') {
          user.survey.name = user.name;
          survey.push(user.survey);
        }
        rattingCount += 1;
        console.log(user.survey);
        ratting[user.survey.ratting.toFixed(1).toString()] =
          ratting[user.survey.ratting.toFixed(1).toString()] + 1;
        rattingAvg += user.survey.ratting;
      }
    });
    console.log(rattingAvg);
    console.log(rattingCount);
    res.send({
      ratting: ratting,
      rattingAvg: rattingAvg / rattingCount,
      survey: survey,
    });
  } catch (err) {
    res.send({ message: err.message });
  }
};

//repost cat
exports.reportCat = async (req, res, next) => {
  console.log(req.body.idCat);
  const report = req.body.report;
  const idCat = req.body.idCat;
  try {
    let cat = await Cat.find({ _id: idCat });

    let tempReport = cat[0].report;

    let updateReport = [...tempReport, report];

    await Cat.findByIdAndUpdate(idCat, {
      report: updateReport,
    });
    //console.log(deleteCat);
    res.status(200).json();
  } catch (error) {
    // console.log(error);
    res.status(404).json(error);
  }
};

exports.getReportCat = async (req, res, next) => {
  try {
    let cat = await Cat.find();

    let reportCat = [];

    for (let i = 0; i < cat.length; i++) {
      if (
        cat[i].report != null &&
        cat[i].report != undefined &&
        cat[i].report.length != 0
      ) {
        for (let j = 0; j < cat[i].report.length; j++) {
          //console.log(j);

          let user = await User.find({ _id: cat[i].report[j].idOwner });

          try {
            cat[i].report[j].nameUserReport = user[0].name;
          } catch (err) {
            cat[i].report[j].nameUserReport = '???';
          }

          // console.log(cat[i]);
        }
        reportCat.push(cat[i]);
      }
    }
    console.log('ๅๅ');
    console.log(reportCat);
    res.send(reportCat);
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
};
