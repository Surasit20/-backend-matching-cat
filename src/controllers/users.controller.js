const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');

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

  if (req.body.tel.length != 10 && req.body.tel[0] != '0') {
    res.send({ message: 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง' });
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
    console.log(user);
    console.log(req.body);
    if (user) {
      console.log(user);
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send(user);
      } else {
        res.send({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      }
    } else {
      res.send({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (err) {
    res.send({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
};

exports.getUser = async (req, res, next) => {
  //return cat of owner
  const idUser = req.params.id;
  const query = { _id: idUser };
  const user = await User.find(query);

  res.send(user);
};

//แก้ไขข้อมูลผู้ใช้
exports.editUser = async (req, res, next) => {
  console.log(req.body.profileImg);
  try {
    const user = await User.findByIdAndUpdate(
      req.body._id,
      {
        email: req.body.email,
        userName: req.body.userName,
        name: req.body.name,
        tel: req.body.tel,
        profileImg: req.body.profileImg,
      },
      { returnOriginal: false }
    );
    res.send(user);
  } catch (err) {}
};

//เปลี่ยนรหัสผ่าน
exports.changePasswordUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.id });
    console.log(user);
    console.log(req.body);
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const newPassword = bcrypt.hashSync(req.body.newPassword);
        await User.findByIdAndUpdate(req.body.id, { password: newPassword });
        res.send({
          message: 'เปลี่ยนรหัสผ่านสำเร็จ',
        });
      } else {
        res.send({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
      }
    } else {
      res.send({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }
  } catch (err) {
    res.send({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
};

/*
exports.createTokenResetPassword = async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email } = req.body;

    // Validate user input
    if (!email) {
      res.status(400).send('All input is required');
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user) {
      // Create token
      const token = jwt.sign({ user_id: user._id, email }, 'dfhfghrth', {
        expiresIn: '5m',
      });

      console.log(user);
      const userAddtoken = await User.findByIdAndUpdate(user._id, {
        tokenResetPassword: token,
      });
      // save user token

      // user
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mythgamer2557@gmail.com',
          pass: 'nwezlwfgihoxxvzu',
        },
      });

      var mailOptions = {
        from: 'mythgamer2557@gmail.com',
        to: 'myfriend@yahoo.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.status(200).json(user);
    } else {
      res.status(400).send('Invalid Credentials');
    }
  } catch (err) {
    console.log('111111111111');
    console.log(err);
  }
  // Our register logic ends here
};
*/
