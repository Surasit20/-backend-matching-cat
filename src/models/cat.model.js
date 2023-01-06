mongoose = require('mongoose');
const catSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: String, required: true },
    breed: { type: String, required: true },
    color: { type: String, required: true },
    sex: { type: String, required: true },
    vaccine: { type: Array, required: false },
    isMatching: { type: Boolean, required: false },
    congenitalDisease: { type: String, required: true },
    natureOfParenting: { type: String, required: true },
    pending: { type: Array, required: false },
    accept: { type: String, required: false },
    request: { type: String, required: false },
    location: { type: Object, required: false },
    address: { type: String, required: false },
    birthday: { type: Date, required: false },
    photo: { type: Array, required: false },
    historyCancel: { type: Array, required: false },
    interested: {
      breed: String,
      color: String,
    },
    required: false,
  },
  {
    timestamps: true,
  }
);
const Cat = mongoose.model('Cat', catSchema);
module.exports = Cat;
