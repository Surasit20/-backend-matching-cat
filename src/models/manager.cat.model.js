mongoose = require('mongoose');

const managerCatSchema = new mongoose.Schema({
  breeds: { type: Array, required: false, unique: true },
  colors: { type: Array, required: false, unique: true },
});

const ManagerCat = mongoose.model('ManagerCat', managerCatSchema);

module.exports = ManagerCat;
