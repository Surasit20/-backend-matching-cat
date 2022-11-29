const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  try {
    const newUser = new User({
      //userName: req.body.userName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });

    const user = await newUser.save();

    res.status(201).send({
      _id: user._id,
      //userName: user.Username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (e) {
    res.status(400).send({ 'message error': e.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        });
      } else {
        res.status(401).send({ message: 'Invlid email or password' });
      }
    }
  } catch (err) {
    res.status(401).send({ message: err });
  }
};

exports.test = async (req, res, next) => {
  res.status(200).send({ message: 'Invlid email or password' });
};
