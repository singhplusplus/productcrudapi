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
  user.role = req.body.role;
  user.save()
    .then(
      result => {
        // console.log(result);
        if (!result) {
          return res.json({ success: false, error: err, message: 'Sorry! Something went wrong.'});
        }
        else {
          return res.status(200).json({success: true, user: result })
        }
      }
    )
    .catch(
      err => {
        console.error(err);
        if (err.code == 11000) {
          return res.json({success: false, error: err, message: 'This email adrress is already registered.'});
        }
        else {
          return res.json({success: false, error: err, message: 'Sorry! Something went wrong.'});
        }
      }
    );
  
});

router.post("/login", (req, res) => {
  // call for passport authentication
  passport.authenticate(
    'local',
    (err, user, info) => {       
      // error from passport middleware
      if (err) return res.json({success: false, error: err, message: 'Sorry! Something went wrong with Authentication.'});
      // registered user
      else if (user) return res.status(200).json({success: true, "token": user.generateJwt() });
      // unknown user or wrong password
      else return res.json({success: false, error: info, message: 'Wrong credentials!'});
    }
  )(req, res);
});

router.get("/profile/:email", authenticate.verifyJwtToken, (req, res) => {
  const findFilter = {email: req.params.email};
  UserModel.findOne(findFilter)
    .exec()
    .then(
      user => {
        if (!user) {
          return res.json({ success: false, message: 'User record not found.' });
        }
        else {
          return res.status(200).json({success: true, user: _.pick(user, ['fullName', 'email', 'role']) })
        }
      }
    )
    .catch(
      err => {
        console.error(err);
        res.status(500).json({success: false, error: err});
      }
    );
});


router.get("/adminprofile", (req, res) => {
  const findFilter = {role: "Admin"};
  UserModel.findOne(findFilter)
    .exec()
    .then(
      user => {
        if (!user) {
          return res.json({ success: false, message: 'No Admin user found.' });
        }
        else {
          return res.json({success: true, user: _.pick(user, ['fullName', 'email', 'role']) })
        }
      }
    )
    .catch(
      err => {
        console.error(err);
        res.json({success: false, message: err.message});
      }
    );
});

module.exports = router;