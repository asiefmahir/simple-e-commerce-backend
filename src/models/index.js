const User = require('./user');
const Product = require('./product')
const Order = require('./order')
const Review = require('./review');
const Category = require('./category')

const models = {
    User,
    Product,
    Order,
    Review,
    Category
}

module.exports = models;