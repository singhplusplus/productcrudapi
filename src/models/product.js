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


// productModel.pre('save', async() => {
//   if(!this.new) {
//     // next();
//     console.log("pre not new");
//     return;
//   }
//   console.log("pre new");
//   const newId = await counterModel.increment('productId');
//   this.productId = newId;
//   // autoIncrementModelID('productId', this, next);
// });

module.exports = mongoose.model('Product', productModel);