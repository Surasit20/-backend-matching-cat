const { query } = require('express');
const ManagerCat = require('../models/manager.cat.model.js');

exports.getBreeds = async (req, res, next) => {
  const managerCats = await ManagerCat.find();

  res.send(managerCats[0]['breeds']);
};

exports.getColors = async (req, res, next) => {
  const managerCats = await ManagerCat.find();

  res.send(managerCats[0]['colors']);
};
