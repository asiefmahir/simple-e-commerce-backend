const express = require('express')
const users = require('./user');
const products = require('./product')
const orders = require('./order');
const reviews = require('./reviewController');
const category = require('./category')

let router = express.Router();

router.use('/users', users);
router.use('/products', products);
router.use('/orders', orders);
router.use('/reviews', reviews);
router.use('/category', category)

module.exports = router;