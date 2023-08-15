const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Doctor = require("../models/DoctorModel");


exports.isAuthenticatedUser = catchAsyncError(async (req,res,next) =>{
    const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login for access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.isAuthenticatedDoctor = catchAsyncError(async (req,res,next) =>{
  const { token } = req.cookies;

if (!token) {
  return next(new ErrorHandler("Please Login for access this resource", 401));
}

const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

req.doctor = await Doctor.findById(decodedData.id);

next();
});

//Admin Roles
exports.authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
          return next(new ErrorHandler(`${req.user.role} can not access this resources`));
        };
        next();
    }
}