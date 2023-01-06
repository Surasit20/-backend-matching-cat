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

    //count /
    if (element.RequestCat != '') {
      report.totalRequestCat += 1;
    }
  });
  res.send(report);
};

exports.getUserReport = async (req, res, next) => {
  const Users = await User.find();

  res.send({ length: Users.length, users: Users });
};
