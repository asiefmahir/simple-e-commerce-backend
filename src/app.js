const express = require("express");
const cors = require("cors");
const configureRoutes = require("./controllers");
const dotenv = require("dotenv");
const path = require("path");
const { handleError } = require("./middlewares");

dotenv.config();

const app = express();
app.use(express.static('public'));

app.use(cors())
app.use(express.json());
configureRoutes(app)
app.use(handleError)

module.exports = app;
