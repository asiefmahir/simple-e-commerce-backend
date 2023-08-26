const mongoose = require('mongoose');


const category = new mongoose.Schema({
    title: {type: 'string', required: true},
    products: [{type: mongoose.Types.ObjectId, ref: 'Product'}]
});

const Category = mongoose.model("Category", category);


module.exports = Category;

