const express = require('express');
const Products = require('./../models/product.js');
const Counters = require('./../models/counter.js');
const moment = require('moment');
const router = express.Router();

// get all products
router.get("/all", async (req, res) => {
  try {
    const items = await Products.find({});

    res.json({success: true, items});
  } catch (e) {
    res.json({success: false, error: "ERROR No products found"});
  }
});

// filter product list by name and category
router.get("/search/:text", (req, res) => {
  try {
    // regex for case insensitive check
    const searchRegex = new RegExp(req.params.text, 'i');
    const searchBy = req.query.searchby;
    let searchFilter;
    switch(searchBy) {
      case 'name':
        searchFilter = {productName: searchRegex};
        break;
      case 'category':
        searchFilter = {productCategory: searchRegex};
        break;
      default:
        console.error("Search by query parameter missing");
    }
    Products.find(searchFilter)
      .exec()
      .then(result => res.json({success: true, items: result}))
      .catch(
        err => {
          res.json({success: false, error: "ERROR No products found"});
        }
    );
  } catch (e) {
    res.json({success: false, error: "ERROR No products found"});
  }
});

// filter product list by date range
router.get("/searchbydate", (req, res) => {
  try {
    // const searchRegex = new RegExp(req.params.text, 'i');
    const startDate = req.query.startdate;
    const endDate = req.query.enddate;
    if(!startDate || !endDate) {
      console.error("one of the date parameter missing");
    }
    const startDateISO = moment(startDate).format();
    const endDateISO = moment(endDate).format();
    const searchFilter = {
      dateOfManufacture: { $gte: startDateISO, $lt: endDateISO }
    };

    Products.find(searchFilter)
      .exec()
      .then(result => res.json({success: true, items: result}))
      .catch(
        err => {
          res.json({success: false, error: "ERROR No products found"});
        }
    );
  } catch (e) {
    res.json({success: false, error: "ERROR No products found"});
  }
});

router.post("/edit",  (req,res) => {
  const findFilter = {productId: req.body.productId};
  const updateValues = {
    productName: req.body.productName,
    productCategory: req.body.productCategory,
    dateOfManufacture: req.body.dateOfManufacture
  };
  Products.findOneAndUpdate(findFilter, updateValues, {returnOriginal: false})
    .exec()
    .then(result => res.json({success: true, items: result}))
    .catch(
      err => {
        res.json({success: false, error: "ERROR Product not updated"});
      }
    );
});

// Completed
router.post("/add", (req, res) => {
  let seqId = 1;
  Counters.findOneAndUpdate(
    {counterId: "productId"},
    {"$inc": {seq: 1}},
    {new: true} 
  ).exec()
  .then(
    async (result) => {
      try {
        if(!result) { // the Counter document does not have productId: seq
          const newSeq = new Counters({counterId: 'productId', seq: seqId});
          await newSeq.save();
        }
        else { // the Counter document updated with new productId: seq
          seqId = result.seq;
        }
        const newProduct = new Products({
          productId: seqId,
          productName: req.body.productName,
          productCategory: req.body.productCategory,
          dateOfManufacture: req.body.dateOfManufacture
        });
        const savedItem = await newProduct.save();
        return res.json({success: true, item: savedItem});
      } catch (err) {
        return res.json({success: false, error: "ERROR No product added"});
      }
    }
  )
  .catch(
    err => {
      return res.json({success: false, error: "ERROR No product added"});
    }
  );
});

router.post("/addmultiple", (req, res) => {
  const prodArray = req.body.productsArray;
  if(!prodArray || !(prodArray.length > 0)) {
    return res.json({success: false, error: "ERROR No products added"});
  }
  let seqId = prodArray.length;
  Counters.findOneAndUpdate(
    {counterId: "productId"},
    {"$inc": {seq: prodArray.length}},
    {new: true} 
  ).exec()
  .then(
    async (result) => {
      try {
        if(!result) { // the Counter document does not have productId: seq
          const newSeq = new Counters({counterId: 'productId', seq: prodArray.length});
          await newSeq.save();
        }
        else { // the Counter document updated with new productId: seq
          seqId = result.seq;
        }
        // to add productId in each product document
        for (let index = prodArray.length - 1; index >= 0; index--) {
          const prod = prodArray[index];
          prod.productId = seqId--; // dont use seqId after here its mutated
        }
        const savedProductsList = await Products.insertMany(prodArray);
        return res.json({success: true, item: savedProductsList});
      } catch (err) {
        return res.json({success: false, error: "ERROR No products added"});
      }
    }
  )
  .catch(
    err => {
      res.json({success: false, error: "ERROR No products added"});
    }
  );
});

router.delete("/delete/:productId",  (req,res) => {
  const findFilter = {productId: req.params.productId};
  Products.findOneAndDelete(findFilter)
    .exec()
    .then(result => res.json({success: true, item: result}))
    .catch(
      err => {
        res.json({success: false, error: "Product not deleted"});
      }
    );
});


module.exports = router;