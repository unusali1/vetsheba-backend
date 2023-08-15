const express = require('express');
const { isAuthenticatedDoctor} = require("../middleware/auth");
const router = express.Router();
const upload =require("../conectCloudinary/multer");
const cloudinary = require("../conectCloudinary/cluodinary");
const Doctor =require("../models/DoctorModel.js");
const sendToken = require("../utils/jwtToken.js");
const { createDoctor, getAllDoctors, getSingleDoctor, updatDoctor, deleteDoctor, getAllDoctorsAdmin} = require('../controller/DoctorController');
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


router
  .route("/doctor/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createDoctor);


router.route("/doctors").get(getAllDoctors);
router.route("/admin/doctors").get( isAuthenticatedUser ,authorizeRoles("admin") ,getAllDoctorsAdmin);

router.route("/doctor/:id").put(isAuthenticatedUser, authorizeRoles("admin"),  updatDoctor);


router
  .route("/doctor/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteDoctor);

router.route("/doctor/:id").get(getSingleDoctor);





module.exports = router;