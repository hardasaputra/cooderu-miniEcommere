const { User } = require("../models");
const { Role } = require("../models");
const { Balance } = require("../models");
const { History } = require("../models");
const { Product } = require("../models");
const { sequelize } = require("../models");

const { generateToken } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const role = require("../models/role");

const signUp = async (req, res) => {
  const body = req.body;
  const username = body.username;
  const email = body.email;
  const password = body.password;

  try {
    const check = await User.findOne({
      where: {
        email: email,
      },
    });
    if (check) {
      return res.status(400).send({
        message: "Email already exist",
      });
    }

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    const create = await User.create({
      userName: username,
      email: email,
      password: hashPassword,
    });
    const role = await Role.create({
      userId: create.id,
      role: 2,
    });

    delete create["password"];

    res.status(200).send({
      status: "Success",
      message: "User berhasil dibuat",
      data: create,
      role,
    });
  } catch {
    (e) => {
      res.status(500).send({
        status: "Internal server error",
        message: e,
      });
    };
  }
};

const signIn = async (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  User.findOne({
    where: {
      email: email,
    },
    include: {
      model: Role,
      as: "role",
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          message: "Email not found",
        });
      }

      const isValidPassword = bcrypt.compareSync(password, user.password);

      if (!isValidPassword) {
        return res.status(400).send({
          message: "Password is not match",
        });
      }
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: role.role,
      });
      return res.status(200).send({
        status: "Success",
        message: "User login Success",
        data: {
          id: user.id,
          email: user.email,
          token: token,
        },
      });
    })
    .catch((e) => {
      console.log(e);

      return res.status(500).send({
        message: "Internal server eror",
      });
    });
};

const getHistoryUser = async (req, res) => {
  const userId = req.id;

  return History.findAll({
    where: {
      userId: userId,
    },
    attributes: [
      "id",
      [sequelize.literal(`"user"."userName"`), "Name"],
      [sequelize.literal(`"product"."name"`), "productName"],
      "quantity",
      "totalPrice",
    ],
    include: [
      {
        model: User,
        as: "user",
        attributes: [],
      },
      {
        model: Product,
        as: "product",
        attributes: [],
      },
    ],
  })
    .then((product) => {
      console.log(product);
      res.status(200).send({
        status: "success get user history",
        data: product,
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send({
        status: "Internal Server Error",
      });
    });
};

module.exports = {
  signUp,
  signIn,
  getHistoryUser,
};
