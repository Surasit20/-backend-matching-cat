mongoose = require('mongoose');
const catSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    feedSystem: { type: String, required: true },
    owner: { type: String, required: true },
    breed: { type: String, required: true },
    color: { type: String, required: true },
    sex: { type: String, required: true },
    vaccine: { type: Array, required: false },
    isMatching: { type: Boolean, required: false },
    congenitalDisease: { type: String, required: false, default: '-' },
    natureOfParenting: { type: String, required: false, default: '-' },
    pending: { type: Array, required: false },
    accept: { type: String, required: false, default: '' },
    request: { type: String, required: false, default: '' },
    location: { type: Object, required: true },
    address: { type: String, required: true },
    birthday: { type: Date, required: false },
    photo: { type: Array, required: false },
    historyCancel: { type: Array, required: false },
    report: { type: Array, required: false },
    interested: {
      breed: String,
      color: String,
      feedSystem: String,
      vaccine: String,
    },
    required: false,
  },

  {
    timestamps: true,
  }
);
const Cat = mongoose.model('Cat', catSchema);
module.exports = Cat;
