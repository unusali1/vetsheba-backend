const express = require('express');
const { isAuthenticatedUser,authorizeRoles} = require("../middleware/auth");
const { createUser, loginUser, logoutUser, forgotPassword, resetPassword, userDetails, updatePassword, updateProfile, getAllUsers, getSingleUser,updateUserRole, deleteUser } = require('../controller/UserController');
const router = express.Router();
const upload =require("../conectCloudinary/multer");
const cloudinary = require("../conectCloudinary/cluodinary");
const User =require("../models/UserModel.js");
const sendToken = require("../utils/jwtToken.js");

router.post("/registration", upload.single("avatar"), createUser);
//router.route("/registration").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get( isAuthenticatedUser ,userDetails);
router.route("/me/update").put( isAuthenticatedUser , updatePassword);
router.put("/me/update/info/:id",upload.single("avatar") , isAuthenticatedUser , updateProfile);
router.route("/admin/users").get( isAuthenticatedUser, authorizeRoles("admin") , getAllUsers);
router.route("/admin/user/:id").get( isAuthenticatedUser, authorizeRoles("admin") , getSingleUser);
router.route("/admin/user/:id").put( isAuthenticatedUser, authorizeRoles("admin") , updateUserRole);
router.route("/admin/user/:id").delete( isAuthenticatedUser, authorizeRoles("admin") , deleteUser);



module.exports = router;