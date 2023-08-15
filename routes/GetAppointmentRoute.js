const express = require("express");
const { createAppointment, getSingleAppointment, getAllAppointments, getAdminAllAppointments, deleteAppointment } = require("../controller/GetAppointmentController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/appointment/new").post(isAuthenticatedUser, createAppointment);

router.route("/appointment/:id").get(isAuthenticatedUser, getSingleAppointment);

router.route("/apointments/me").get(isAuthenticatedUser, getAllAppointments);

router.route("/admin/appointments").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminAllAppointments);

router.route("/admin/appointment/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteAppointment);

module.exports = router;
