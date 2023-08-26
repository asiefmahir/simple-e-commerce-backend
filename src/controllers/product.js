const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const { NotFound } = require("../utils/errors");
const {
	getAllProduct,
	getProductById,
	saveProduct,
	updateProduct,
	deleteProductById,
} = require("../services/product");
const { checkLogin, adminMiddleware } = require("../middlewares");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public");
	},
	filename: function (req, file, cb) {
		const fileExt = path.extname(file.originalname);
		const fileName =
			file.originalname
				.replace(fileExt, "")
				.toLowerCase()
				.split(" ")
				.join("-") +
			"-" +
			uuidv4();

		cb(null, fileName + fileExt);
	},
});
const upload = multer({ storage: storage });

const router = express.Router();

const getHandler = async (req, res, next) => {
	const take = Number(req.query.take) || 10;
	const page = Number(req.query.page) || 1;

	const skip = (page - 1) * take;
	try {
		const data = await getAllProduct(take, skip);
		const productsWithImageURLs = data.map((product) => {
            let doc = product._doc
			const imageUrl = `${req.protocol}://${req.get("host")}/${product.image}`;
			return { ...doc, image: imageUrl};
		});
        console.log(productsWithImageURLs);
		res.status(200).send(productsWithImageURLs);
	} catch (error) {
		return next(error, req, res);
	}
};

const getByIdHandler = async (req, res, next) => {
	try {
		const id = req.params.id;
		let product = await getProductById(id);
		let doc = product._doc
		const imageUrl = `${req.protocol}://${req.get("host")}/${product.image}`;
		product = { ...doc, image: imageUrl};
		if (product) {
			res.status(200).send(product);
		} else {
			throw new NotFound("The Item not found by the id: " + id);
		}
	} catch (error) {
		return next(error, req, res);
	}
};

const postHandler = async (req, res, next) => {
	console.log("I am post");
	try {
		const body = req.body;
		console.log(req.body);
		const image = req.file.filename;
		console.log(image);
		const payload = { ...body, image };
		const id = await saveProduct(payload);
		res.status(201).send(id);
	} catch (error) {
		return next(error, req, res);
	}
};

const putHandler = async (req, res, next) => {
	try {
		const id = req.params.id;
		const body = req.body;
		const image = req.file.filename;
		const payload = { body, image, id };
		const result = await updateProduct(payload);
		console.log(result, 'from ct');
		res.status(200).send(result);
	} catch (error) {
		next(error, req, res);
	}
};
const deleteHandler = async (req, res, next) => {
	try {
		const id = req.params.id;
		await deleteProductById(id);
		console.log(`I am called`);
		res.status(200).send("Product deleted");
	} catch (error) {
		return next(error, req, res);
	}
};

router.get("/", getHandler);
router.get("/:id", getByIdHandler);
router.post(
	"/",
	checkLogin,
	adminMiddleware,
	upload.single("image"),
	postHandler
);
router.put("/:id", checkLogin, adminMiddleware, upload.single("image"), putHandler);
router.delete("/:id", checkLogin, adminMiddleware, deleteHandler);

module.exports = router;
