const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  createProductReview,
  getSingleProductReviews,
  deleteReview,
  getAllProductsAdmin,
} = require("../controller/ProductController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const upload =require("../conectCloudinary/multer");

const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get( isAuthenticatedUser ,authorizeRoles("admin") ,getAllProductsAdmin);

router
  .route("/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
 

router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct);
router.route("/product/review").post(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getSingleProductReviews);

router
  .route("/reviews/:id")
  .get(getSingleProductReviews)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

module.exports = router;