const mongoose = require('mongoose');

const counterModel = new mongoose.Schema({
  counterId: {
    type: String,
    unique: true,
    required: true
  },
  seq: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Counter', counterModel);