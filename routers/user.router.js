const express = require("express");
const router = express.Router();
const { verify } = require("../middlewares/auth");

const {
  signUp,
  signIn,
  getHistoryUser,
  // purchase,
} = require("../controllers/user.controller");

router.post("/signup", signUp);
router.post("/signin", signIn);
// router.post("/purchase", purchase);
router.get("/getHistoryUser", verify, getHistoryUser);

module.exports = router;
