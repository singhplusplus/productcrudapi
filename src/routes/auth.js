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
          return res.json({ success: false, message: 'User record not saved.' });
        }
        else {
          return res.json({success: true, user: result })
        }
      }
    )
    .catch(
      err => {
        console.error(err);
        if (err.code == 11000) {
          return res.json({error: 'Duplicate email adrress found.'});
        }
        else {
          return res.json({error: err});
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
      if (err) return res.status(400).json(err);
      // registered user
      else if (user) return res.status(200).json({ "token": user.generateJwt() });
      // unknown user or wrong password
      else return res.status(404).json(info);
    }
  )(req, res);
});

router.get("/profile/:email", authenticate.verifyJwtToken, (req, res) => {
  // console.log("req res", req, res);
  const findFilter = {email: req.params.email};
  // console.log("req email", req.body.email);
  UserModel.findOne(findFilter)
    .exec()
    .then(
      user => {
        if (!user) {
          return res.status(404).json({ success: false, message: 'User record not found.' });
        }
        else {
          return res.status(200).json({success: true, user: _.pick(user, ['fullName', 'email', 'role']) })
        }
      }
    )
    .catch(
      err => {
        console.error(err);
        res.status(500).json({error: err});
      }
    );
});

module.exports = router;