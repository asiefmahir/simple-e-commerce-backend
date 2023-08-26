const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    description: {type: String, required: true},
    title: {type:String, required: true},
    rating: {type: String, required: true},
    // email : {type: String, required: true},
    user: {type: mongoose.SchemaTypes.ObjectId, ref: 'User'}
})

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review