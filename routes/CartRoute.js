const express = require("express");
const {
  addToCart,
  getCartData,
  updateCart,
  removeCartData,
} = require("../controller/CartController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();



router.route("/addToCart").post(isAuthenticatedUser, addToCart);

router.route("/cart").get(isAuthenticatedUser, getCartData);

router.route("/cart/update/:id").put(isAuthenticatedUser, updateCart);

router.route("/removeCart/:id").delete(isAuthenticatedUser, removeCartData);

module.exports = router;