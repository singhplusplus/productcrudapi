const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const passport = require("passport");
const UserModel = require("./../models/user.js");
const _ = require("lodash");

const authenticate = require("./../utils/authmiddleware.js");

router.post("/register", (req, res) => {
  const user = new UserModel();
  user.fullName = req.body.fullName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save((err, result) => {
    if (!err)
      res.json({success: true, user: result});
    else {
      if (err.code == 11000)
        res.status(422).send(['Duplicate email adrress found.']);
      else
        return next(err);
    }
  });
});

router.post("/login", (req, res) => {
  // call for passport authentication
  passport.authenticate(
    'local',
    (err, user, info) => {       
      // error from passport middleware
      if (err) return res.status(400).json(err);
      // registered user
      else if (user) return res.status(200).json({ "token": user.generateJwt() });
      // unknown user or wrong password
      else return res.status(404).json(info);
    }
  )(req, res);
});

router.get("/profile", authenticate.verifyJwtToken, (req, res) => {
  UserModel.findOne({ _id: req._id },
    (err, user) => {
      if (!user)
        return res.status(404).json({ status: false, message: 'User record not found.' });
      else
        return res.status(200).json({ status: true, user: _.pick(user, ['fullName', 'email']) });
    }
  );
});

module.exports = router;