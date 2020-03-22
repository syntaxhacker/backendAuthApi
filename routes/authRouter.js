const router = require("express").Router();
let User = require("../models/user.model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../config/configs.env" });
// check if valid user

const isUser = async (req, res) => {
  let user, valid;
  try {
    user = await User.findOne({ username: req.body.username });
    valid = await user.comparePassword(req.body.password);
  } catch (e) {
    res.status(400).json({ loggedin: false, err: "username not found" });
  }
  if (valid == false) {
    res.status(400).json({ loggedin: false, err: "incorrect password " });
  } else if (user == null) {
    valid = false;
  }
  return { valid, user };
};
//plaintext --> hashed password
const newHash = async (newpass, res) => {
  let salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(newpass, salt);
};

//generate otp
let otp;
const generateOTP = () => {
  otp = Math.ceil(Math.random() * 1000000).toString();
  return otp;
};
//send otp as email
const emailToUser = async (res, usrMail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS
    }
  });

  const mailOptions = {
    from: usrMail,
    to: "example@mail.com",
    subject: "verify OTP",
    text: generateOTP()
    // html: "<p></p>"
  };

  await transporter.sendMail(mailOptions, function(err, info) {
    if (err) json.status(400).json(err);
    else res.json(`mail sent to ${info.accepted[0]}`);
  });
};

// POST http://localhost:8081/auth/signup
// USAGE:
// {
// 	"username" : "user1",
// 	"password" : "pass"
// }

router.route("/signup").post((req, res) => {
  const { username, password } = req.body;
  const newUser = new User({
    username,
    password
  });

  newUser
    .save()
    .then(() => res.json(`${username} added`))
    .catch(err => res.status(400).json(err.message));
});

// POST http://localhost:8081/auth/login
// USAGE:
// {
// 	"username" : "user1",
// 	"password" : "pass"
// }

router.route("/login").post(async (req, res) => {
  if ((await isUser(req, res)).valid) {
    res.json({ loggedin: true });
  }
});

// POST http://localhost:8081/auth/sendotp/
// USAGE:
// {
//   "username" : "user1",
//   "password" : "pass",
//   "email" : "yourmail@gmail.com"
//   }
router.route("/sendotp").post(async (req, res) => {
  const { valid } = await isUser(req, res);
  if (valid) {
    const { email } = req.body;
    await emailToUser(res, email);
  }
});

// POST http://localhost:8081/auth/forgot
// USAGE:
// {
// 	"username" : "userone",
// 	"password" : "password",
// 	"newpass" : "newpassword",
//  "recievedOtp" : "1203012"
// }
router.route("/forgot").post(async (req, res) => {
  const { valid } = await isUser(req, res);

  if (valid) {
    const { username, newpass, recievedOtp } = req.body;
    console.log(username, newpass, recievedOtp);
    if (newpass.length < 3) {
      res.status(400).json("password length should be atleast 3");
    }
    if (otp === recievedOtp) {
      let hashedPassword = await newHash(newpass, res);
      await User.findOneAndUpdate(
        { username: username },
        { password: hashedPassword },
        { new: true }
      ).then(user => res.json(user));
    } else {
      res.status(400).json("submitted otp is wrong!");
    }
  }
});

module.exports = router;
