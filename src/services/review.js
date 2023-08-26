const models = require("../models");
const {NotFound} = require('../utils/errors')

const Model = models.Review;

const getAllReview = async () => {
  const reviews = await Model.find().populate('user');
  return reviews;
};

const getReviewById = async (id) => {
  const review = await Model.findById(id).populate('user');
  return review;
};

const saveReview = async (review) => {
  const {title, description, rating} = review;
  const reviewObject = {title, description, rating};
  const user = await models.User.findOne({email: review.email});
  const userId = user._id
  const item = await Model.create({...reviewObject, user: userId});
  await models.User.updateOne({
    email: review.email
  }, {
    $push: {
      reviews: item._id
    }
  })

  return item._id;
};

const updateReview = async (id, obj) => {
  const item = await Model.findById(id);
  if (item) {
    item.rating = obj.rating || item.rating;
    item.title = obj.title || item.title;
    await item.save();
    return item._id;
  }
   throw new NotFound('Review not found by the id: ' + id);
};

const deleteReviewById = async (id) => {
    const item = await Model.findById(id);
    if(item) {
        await Model.deleteOne({_id: id})
    }
    throw new NotFound('Review not found by the id: ' + id);
};

module.exports = {
    getAllReview,
    getReviewById,
    saveReview,
    updateReview,
    deleteReviewById
}
