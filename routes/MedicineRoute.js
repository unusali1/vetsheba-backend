const express = require("express");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const upload =require("../conectCloudinary/multer");
const { getAllMedicine, getAllMedicinesAdmin, createMedicine, updateMedicine, deleteMedicine, createMedicineReview, getSingleMedicineReviews, deleteMedicineReview, getSingleMedicine } = require("../controller/MedicineController");

const router = express.Router();

router.route("/medicines").get(getAllMedicine);
router.route("/admin/medicines").get( isAuthenticatedUser ,authorizeRoles("admin") ,getAllMedicinesAdmin);

router
  .route("/medicine/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createMedicine);
 

router
  .route("/medicine/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateMedicine);

router
  .route("/medicine/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteMedicine);

router.route("/medicine/:id").get(getSingleMedicine);
router.route("/medicine/review").post(isAuthenticatedUser, createMedicineReview);

router.route("/medicine/reviews").get(getSingleMedicineReviews);

router
  .route("/medicine/reviews/:id")
  .get(getSingleMedicineReviews)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteMedicineReview);

module.exports = router;