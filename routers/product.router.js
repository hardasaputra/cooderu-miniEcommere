const express = require("express");
const router = express.Router();

const {
  getListProduct,
  createProduct,
} = require("../controllers/product.controller");

router.get("/getListProduct", getListProduct);
router.post("/createProduct", createProduct);

module.exports = router;
