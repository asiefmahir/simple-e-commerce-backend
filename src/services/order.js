const models = require("../models");
const {NotFound} = require('../utils/errors')

const Model = models.Order;

const getAllOrders = async (take, skip) => {
    const orders = await Model.find()
        .limit(take)
        .skip(skip)
    // const count = await Model.find()
    //     .limit(take)
    //     .skip(skip).count
    return orders
}

const getUserSpecificOrders = async (id, take, skip) => {
    const orders = await Model.find({user: id}).limit(take).skip(skip)
    // const count = await Model.find()
    //     .limit(take)
    //     .skip(skip).count
    return orders
}

const getOrderById = async (id) => {
  const order = await Model.findById(id)
  return order;
};

const saveOrder = async (order) => {
  // const {title, products, shippingAddress, price, status, user} = order;
  // const orderObject = {title, price, products, shippingAddress, user, status};
  // const user = await models.User.findOne({email: order.email});
  // const userId = user._id;
  const newOrder = await new Model({
    ...order
  });
  const item = await newOrder.save()
  await models.User.updateOne({
    _id: order.user
  }, {
    $push: {
      orders: item._id
    }
  })
  return item._id;
};

const updateOrder = async (id, status) => {
  const item = await Model.findById(id);
  if (item) {
    // item.status = status || item.status;
    // await item.save();
    // console.log(item, 'item');
    const res = await Model.updateOne({_id: id}, {$set: {status: status}});
    console.log(res, 'stat');
    return item._id;
  }
  throw new NotFound('Order not found by the id: ' + id);
};

const deleteOrderById = async (id) => {
    const item = await Model.findById(id);
    if(item) {
        await Model.deleteOne({_id: id})
        return item._id
    }
    throw new NotFound('Order not found by the id: ' + id);
};

module.exports = {
    getAllOrders,
    getOrderById,
    getUserSpecificOrders,
    saveOrder,
    updateOrder,
    deleteOrderById,
    
}
