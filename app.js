const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const database = require("./src/config/database");
const rootRoute = require("./src/routes/index.route");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.use("/api/v1", rootRoute);

app.listen(PORT, () => {
    database();
    console.log(`Server started on port: ${PORT}`);
});
