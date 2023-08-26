const mongoose = require('mongoose');


const product = new mongoose.Schema({
    title: {type: 'string', required: true},
    description: {type: 'string', required: true},
    image: {type: 'string', required: true},
    price: {type: 'string', required: true},
    category: {type: mongoose.Types.ObjectId, ref: 'Category'}
});

const Product = mongoose.model("Product", product);

module.exports = Product;

