const express = require("express");
const { createMdecineOrder, getSingleMedicineOrder, getAllMedicineOrders, updateAdminMedicineOrder, deleteMedicineOrder, getAdminMedicineAllOrders } = require("../controller/MedicineOrderController");


const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/morder/new").post(isAuthenticatedUser, createMdecineOrder);

router.route("/morder/:id").get(isAuthenticatedUser, getSingleMedicineOrder);

router.route("/morders/me").get(isAuthenticatedUser, getAllMedicineOrders);

router
  .route("/admin/morders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminMedicineAllOrders);

router
  .route("/admin/morder/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"),updateAdminMedicineOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteMedicineOrder);

module.exports = router;