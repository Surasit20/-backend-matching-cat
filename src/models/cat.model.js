mongoose = require('mongoose');
const catSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: { type: String, required: true },
    breed: { type: String, required: true },
    color: { type: String, required: true },
    sex: { type: String, required: true },
    //age: { type: Number, required: true },
    age: { type: String, required: true },
    //vaccine: { type: Array, required: false },
    vaccine: { type: String, required: false },
    // matching: { type: Array, required: false },
    matching: { type: String, required: false },
    isMatching: { type: Boolean, required: false, default: false },
    // isMatching: { type: String, required: false },
    congenitalDisease: { type: String, required: true },
    natureOfParenting: { type: String, required: true },
    pending: { type: Array, required: false },
    accept: { type: String, required: false },
    request: { type: String, required: false },
    location: { type: Object, required: false },
    photo: { type: Array, required: false },
  },
  {
    timestamps: true,
  }
);
const Cat = mongoose.model('Cat', catSchema);
module.exports = Cat;
