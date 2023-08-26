const express = require('express');
const jwt = require("jsonwebtoken");
const { saveUser, getById, getAllUser, login, updateUser, deleteUserById } = require("../services/user");
const {checkLogin, adminMiddleware, superAdminMiddleware} =  require('../middlewares')
const { NotFound } = require('../utils/errors');

const router = express.Router();


const getAllHandler = async (req, res, next) => {
    try {
        const users = await getAllUser();
        res.send(users);
    } catch (err) {
        return next(err, req, res);
    }
}

const getByIdHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await getById(id);
        if (user) {
            res.status(200).send(user);
        }
        else {
            throw new NotFound('User not found by the id: ' + id);
        }
    } catch (error) {
        return next(error, req, res);
    }
};

const loginHandler = async (req, res) => {
    if (req.body.email && req.body.password) {
        const user = await login({email: req.body.email, password: req.body.password});
        if (user) {
            const token = jwt.sign(
                {
                    user: user
                },
                process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            const decoded = jwt.decode(token)



            res.status(200).send({
                token: token,
                user: user,
                decoded: decoded,
                message: "Login successful!",
            });
            return;
        }

        res.status(400).json("Invalid username or password");
    } else {
        res.status(400).json("Please Provide valid email and password");
    }
}    


const postHandler = async (req, res, next) => {
    try {
        const body = req.body;
        const id = await saveUser(body);
        res.status(201).json(id);
    } catch (error) {
        console.log(error.message);
        return next(error, req, res);
    }
};

const putHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        const body = req.body;
        console.log(body);
        const result = await updateUser(id, body);
        console.log(result);
        res.status(200).send(result);
    } catch (error) {
        next(error, req, res);
    }
}

const deleteHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteUserById(id);
        console.log(`I am called`);
        res.status(200).send("User deleted Successfully");
    } catch (error) {
        return next(error, req, res);
    }
}


router.get('/', checkLogin, adminMiddleware, getAllHandler);
router.get('/:id', checkLogin, adminMiddleware, getByIdHandler);
router.put('/:id', checkLogin, adminMiddleware, putHandler);
router.delete('/:id', checkLogin, adminMiddleware, deleteHandler)
router.post('/signup', postHandler);
router.post('/login', loginHandler)



module.exports = router;