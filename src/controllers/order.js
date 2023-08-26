const express = require('express');
const {NotFound} = require('../utils/errors')
const {getAllOrders, getOrderById, saveOrder, updateOrder, deleteOrderById, getUserSpecificOrders} = require('../services/order');

const {checkLogin, adminMiddleware} =  require('../middlewares')
// const { getAllCategory } = require('../services/category');


const router = express.Router();


const getHandler = async (req, res, next) => {
    const take = Number(req.query.take) || 10;
    const page = Number(req.query.page) || 1;

    const skip = (page - 1) * take;
     try {
        const data = await getAllOrders(take, skip);
        res.status(200).send(data);
    } catch (error) {
        return next(error, req, res);
    }
}

const getByUserHandler = async (req, res, next) => {
    const take = Number(req.query.take) || 10;
    const page = Number(req.query.page) || 1;

    const skip = (page - 1) * take;
    try {
        const id = req.params.id;
        console.log(id);
        const orders = await getUserSpecificOrders(id, take, skip);
        console.log(orders);
        console.log(orders);
        res.status(200).send(orders)
    } catch (error) {
        return next(error, req, res)
    }
}

const getByIdHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await getOrderById(id);
        if (order) {
            res.status(200).send(order);
        }
        else {
            throw new NotFound('The package not found by the id: ' + id);
        }
    } catch (error) {
        return next(error, req, res);
    }
};

const postHandler = async (req, res, next) => {
    try {
        const body = req.body;
        const id = await saveOrder(body);
        res.status(201).send(id);
    } catch (error) {
        return next(error, req, res);
    }
};
const putHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(req.body.status, 'plz');
        const result = await updateOrder(id, req.body.status);
        res.status(200).send(result);
    } catch (error) {
        return next(error, req, res);
    }
}

const deleteHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteOrderById(id);
        res.status(200).send("Order deleted");
    } catch (error) {
        return next(error, req, res);
    }
}


router.get('/', checkLogin, adminMiddleware, getHandler);
// router.get('/:id', getByIdHandler);
router.get('/:id', checkLogin, getByUserHandler);

router.post('/', checkLogin, postHandler);
router.patch('/:id', checkLogin, adminMiddleware, putHandler);
router.delete('/:id', checkLogin, adminMiddleware, deleteHandler);

module.exports = router;