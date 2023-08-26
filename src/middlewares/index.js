const jwt = require("jsonwebtoken");

const { GeneralError, BadRequest } = require("../utils/errors");
const { MulterError } = require("multer");

const handleError = async (err, req, res, next) => {
    let code = 500;
    if (err instanceof GeneralError) {
        code = err.getCode();
    }
    if (err instanceof MulterError) {
        code = 400;
    }
    return res.status(code).json({
        message: err.message,
    });
};
const handleValidation = (validate) => {
    return (req, res, next) => {
        const result = validate(req.body);
        const isValid = result.error == null;
        if (isValid) {
            return next();
        }

        const { details } = result.error;
        const messages = details.map((e) => e.message);
        const msg = messages.join(",");
        throw new BadRequest(msg);
    };
};

const checkLogin = async (req, res, next) => {
    // console.log(req.headers);
    // const { authorization } = req.headers;

    const token = req.headers.authorization.split(" ")[1];
    // console.log(token, "token");
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).send({
                    success: false,
                    errorMessage: err.message || "Invalid token",
                });
            } else {
                req.user = decoded.user;
                next();
            }
        });

        // if (decoded) {

        //     console.log(decoded);
        //   next();
        // } else if (decoded === undefined) {
        //     console.log(decoded);
        //     throw new GeneralError("Authentication Failed. Please Try To LogIn Again")
        // }
        // console.log(decoded, 'decoded');
        // // console.log(`checking login`);
    } else {
        res.status(401).send({ error: "Unauthenticated request" });
    }
};

const userMiddleware = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(400).json({ message: "User access denied" });
    }
    // console.log(`checking UserMidleware`);

    next();
};

const adminMiddleware = (req, res, next) => {
    // console.log(req.user);
    if (req.user.role !== "admin") {
        if (req.user.role !== "super-admin") {
            // console.log(`checking Admin Midleware`);
            return res.status(400).json({ message: "Admin access denied" });
        }
    }

    next();
};

const superAdminMiddleware = (req, res, next) => {
    if (req.user.role !== "super-admin") {
        return res.status(200).json({ message: "Super Admin access denied" });
    }
    // console.log(`checking SuperAdmin Midleware`);

    next();
};
module.exports = {
    handleValidation,
    handleError,
    checkLogin,
    userMiddleware,
    adminMiddleware,
    superAdminMiddleware,
};
