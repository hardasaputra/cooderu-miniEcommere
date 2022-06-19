const { Product } = require("../models");

const getListProduct = async (req, res) => {
  return Product.findAll({})
    .then((product) => {
      res.status(400).send({
        status: "Success",
        message: "Berikut daftar product",
        data: product,
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send({
        status: "Fail",
        message: "Gagal melihat product",
      });
    });
};

const createProduct = async (req, res) => {
  const body = req.body;
  const name = body.name;
  const category = body.category;
  const price = body.price;
  const quantity = body.quantity;

  Product.create({
    name: name,
    category: category,
    price: price,
    quantity: quantity,
  })
    .then((product) => {
      res.status(200).send({
        status: "Success add product",
        message: "Product Added",
        data: product,
      });
    })
    .catch((e) => {
      res.send({
        status: "Internal server eror",
        message: e,
      });
    });
};

module.exports = {
  getListProduct,
  createProduct,
};
