const express = require('express');

const auth = require("./auth.js");
const product = require("./product.js");
const authenticate = require("./../utils/authmiddleware.js");

const router = express.Router();

router.use('/auth', auth);
router.use('/product', authenticate.verifyJwtToken, product);

module.exports = router;