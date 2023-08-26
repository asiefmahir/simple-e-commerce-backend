const express = require('express');
const {NotFound} = require('../utils/errors')
const {getAllCategory, getCategoryById, saveCategory, updateCategory, deleteCategoryById} = require('../services/category')
const {checkLogin, adminMiddleware} =  require('../middlewares')



const router = express.Router();

const getHandler = async (req, res, next) => {
    const take = Number(req.query.take) || 10;
    const page = Number(req.query.page) || 1;

    const skip = (page - 1) * take;
     try {
        const data = await getAllCategory(take, skip);
        res.status(200).send(data);
    } catch (error) {
        return next(error, req, res);
    }
    //  try {
    //     const products = await getAllProduct();
    //     res.status(200).send(products);
    // } catch (error) {
    //     return next(error, req, res);
    // }
}

const getByIdHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await getCategoryById(id);
        if (category) {
            res.status(200).send(category);
        }
        else {
            throw new NotFound('The Item not found by the id: ' + id);
        }
    } catch (error) {
        return next(error, req, res);
    }
};

// const getSearchHandler = async (req, res, next) => {
//     let {searchString, price, filterMethod, page, take, orderKey, orderValue} = req.query;

//     take = Number(take) || 10;
//     page = Number(page) || 1;
//     const skip = (page - 1) * take;

//     try {
//         const data = await getSearchedProduct(searchString, price, filterMethod, skip, take, orderKey, orderValue);
//         res.status(200).send(data);
//     } catch (error) {
//         next(error, req, res)
//     }
// }


const postHandler = async (req, res, next) => {
    try {
        const body = req.body;
        const id = await saveCategory(body);
        res.status(201).send(id);
    } catch (error) {
        return next(error, req, res);
    }
};

const putHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const result = await updateCategory(id, body);
        res.status(200).send(result);
    } catch (error) {
        next(error, req, res);
    }
}
const deleteHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteCategoryId(id);
        res.status(200).send("Product deleted");
    } catch (error) {
        return next(error, req, res);
    }
}


router.get('/', getHandler);
router.get('/:id', getByIdHandler);
router.post('/', checkLogin, adminMiddleware, postHandler);
router.put('/:id', checkLogin, adminMiddleware, putHandler);
router.delete('/:id', checkLogin, adminMiddleware, deleteHandler);

module.exports = router;