const mongoose = require('mongoose');

// const counterModel = require('./loginconfig.js');

const productModel = new mongoose.Schema({
  productId: {
    type: Number,
    default: 1,
    immutable: true,
    unique: true,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productCategory: {
    type: String,
    required: true
  },
  dateOfManufacture: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Product', productModel);