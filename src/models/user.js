const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userModel = new mongoose.Schema({
  fullName: {
      type: String,
      required: "Full name cant be empty"
  },
  email: {
      type: String,
      required: "Email cant be empty",
      unique: true
  },
  password: {
      type: String,
      required: "Password cant be empty",
      minlength: [8, 'Password must be atleast 8 character long']
  },
  role: {
    type: String,
    default: 'Client'
  },
  saltSecret: String
});

// Custom validation for email
// userModel.path('email').validate((val) => {
//   emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return emailRegex.test(val);
// }, 'Invalid e-mail.');

userModel.pre('save', function (next) {
  bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
          this.password = hash;
          this.saltSecret = salt;
          next();
      });
  });
});

userModel.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userModel.methods.generateJwt = function () {
  return jwt.sign({ email: this.email},
      'JWT_SECRET',
      {expiresIn: '30m'}
  );
}

module.exports = mongoose.model('User', userModel);
