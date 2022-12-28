const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');

exports.register = async (req, res, next) => {
  if (
    req.body.userName == '' ||
    req.body.email == '' ||
    req.body.password == '' ||
    req.body.tel == '' ||
    req.body.name == ''
  ) {
    res.send({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    return;
  }
  try {
    console.log(req.body.password);
    let userCheck = await User.find({ email: req.body.email });

    if (userCheck.length != 0) {
      console.log('emdil');
      res.send({ message: 'อีเมลซ้ำ' });
      return;
    }

    userCheck = await User.find({ userName: req.body.userName });
    console.log(userCheck);
    if (userCheck.length != 0) {
      console.log('userName');
      res.send({ message: 'ชื่อผู้ใช้ซ้ำ' });
      return;
    }
    userCheck = await User.find({ tel: req.body.tel });
    if (userCheck.length != 0) {
      console.log('tel');
      res.send({ message: 'เบอร์โทรศัพท์ซ้ำ' });
      return;
    }

    const newUser = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      userName: req.body.userName,
      name: req.body.name,
      tel: req.body.tel,
    });

    const user = await newUser.save();

    res.status(201).send({
      _id: user._id,
      userName: user.Username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (e) {
    console.log(e);

    res.send({ message: 'ไม่สามารถลงทะเบียนได้' });
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
    } else {
      res.status(401).send({ message: 'Invlid email or password' });
    }
  } catch (err) {
    res.status(401).send({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
};

exports.getUser = async (req, res, next) => {
  //return cat of owner
  const idUser = req.params.id;
  const query = { _id: idUser };
  const user = await User.find(query);

  res.send(user);
};
