const express = require('express');
const Products = require('./../models/product.js');
const Counters = require('./../models/counter.js');

const router = express.Router();

// add update delete  getOnebyNameOrCategory


// get all products
router.get("/all", async (req, res) => {
  try {
    // console.log("collection");
    const items = await Products.find({});

    res.json({success: true, items});
  } catch (e) {
    console.error(e);
    res.json({error: "ERROR No products found"});
  }
});

// filter product list by name and category
router.get("/search/:text", async (req, res) => {
  try {
    // regex for case insensitive check
    const searchRegex = new RegExp(req.params.text, 'i');
    const searchFilter = {
      $or: [
        {productName: searchRegex},
        {productCategory: searchRegex}
      ]
    };
    Products.find(searchFilter)
      .exec()
      .then(result => res.json({success: true, items: result}))
      .catch(
        err => {
          console.error(err);
          res.json({error: "ERROR No products found"});
        }
      );
  } catch (e) {
    console.error(e);
    res.json({error: "ERROR No products found"});
  }
});

router.post("/edit",  (req,res) => {
  const findFilter = {productId: req.body.productId};
  const updateValues = {
    productName: req.body.productName,
    productCategory: req.body.productCategory
  };
  Products.findOneAndUpdate(findFilter, updateValues, {returnOriginal: false})
    .exec()
    .then(result => res.json({success: true, items: result}))
    .catch(
      err => {
        console.error(err);
        res.json({error: "ERROR Product not updated"});
      }
    );
});

// Completed
router.post("/add", (req, res) => {
  Counters.findOneAndUpdate(
    {counterId: "productId"},
    {"$inc": {seq: 1}},
    {new: true} 
  ).exec()
  .then(
    async (result) => {
      if(!result) {
        console.log("result", result);
        const newSeq = new Counters({counterId: 'productId', seq: 1});
        await newSeq.save();
        seqId = 1;
      }
      else {
        seqId = result.seq;
      }
      // res.json({success: true, items: result})
      const newProduct = new Products({
        productId: seqId,
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        dateOfManufacture: req.body.dateOfManufacture
      });
      // const new
      const savedItem = await newProduct.save();
      console.log("savedItem",  savedItem);
      return res.json({success: true, items: savedItem});
    }
  )
  .catch(
    err => {
      console.error(err);
      res.json({error: "ERROR No products found"});
    }
  );
});

// TODO;  need to change it to app.post
router.get("uploadFile", async (req, res) => {});

// function handleResponse(res) {
//   console.log("res", res);
//   return res.json({success: true, items: res});
// }
// function handleError(err, msg) {
//   console.error(err);
//   return res.json({error: msg});
// }

module.exports = router;