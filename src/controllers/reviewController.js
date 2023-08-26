const express = require('express');
const {NotFound} = require('../utils/errors')
const {getAllReview, getReviewById, saveReview, updateReview, deleteReviewById } = require('../services/review')


const router = express.Router();


const getHandler = async (req, res, next) => {
     try {
        const reviews = await getAllReview();
        res.status(200).send(reviews);
    } catch (error) {
        return next(error, req, res);
    }
}

const getByIdHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const review = await getReviewById(id);
        if (review) {
            res.status(200).send(review);
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
        const id = await saveReview(body);
        res.status(201).send(id);
    } catch (error) {
        return next(error, req, res);
    }
};
const putHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await updateReview(id, req.body);
        res.status(200).send(result);
    } catch (error) {
        return next(error, req, res);
    }
}

const deleteHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteReviewById(id);
        res.status(200).send("Review deleted");
    } catch (error) {
        return next(error, req, res);
    }
}


router.get('/', getHandler);
router.get('/:id', getByIdHandler);
router.post('/', postHandler);
router.put('/:id', putHandler);
router.delete('/:id', deleteHandler);

module.exports = router;