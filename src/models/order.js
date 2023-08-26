const mongoose = require('mongoose');


const order = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: String, required: true},
    products: [{type: mongoose.Types.ObjectId, ref: 'Product'}],
    status: {type: String, enum: ['pending', 'picked', 'delivered'], default: 'pending'},
    shippingAddress: {type: String, required: true},
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
});

const Order = mongoose.model("Order", order);


module.exports = Order;