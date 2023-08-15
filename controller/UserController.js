const User =require("../models/UserModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken.js");
const sendMail = require("../utils/sendMail.js");
const crypto =require("crypto");
const upload =require("../conectCloudinary/multer");
const cloudinary = require("../conectCloudinary/cluodinary");
const bcrypt = require('bcryptjs');


// Register user
exports.createUser = catchAsyncError(async (req, res, next) => {
  try {

 
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new user
   let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    });
    // Save user
    await user.save();
    //res.json(user);
    sendToken(user, 201, res);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//Login user

exports.loginUser =catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("please enter your email and password",400));

    }
    const user =await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("user is not found with this email & password",401));

    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Password is Invalid",401));
    }
 
    sendToken(user,201,res);


});

//logout user
exports.logoutUser = catchAsyncError( (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  
    res.status(200).json({
      success: true,
      message: "Log out success",
    });
  });

//Forget password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHandler("User not found with this email", 404));
    }
  
    // Get ResetPassword Token
  
    const resetToken = user.getResetToken();
  
    await user.save({
      validateBeforeSave: false,
    });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;

  try {
    await sendMail({
      email: user.email,
      subject: ` Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} succesfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return next(new ErrorHandler(error.message, 500));
  }
  });

 //Reset Password
 exports.resetPassword = catchAsyncError(async (req, res, next) => {
 // Create Token hash

 const resetPasswordToken = crypto
 .createHash("sha256")
 .update(req.params.token)
 .digest("hex");

const user = await User.findOne({
 resetPasswordToken,
 resetPasswordTime: { $gt: Date.now() },
});

if (!user) {
 return next(
   new ErrorHandler("Reset password url is invalid or has been expired", 400)
 );
}

if (req.body.password !== req.body.confirmPassword) {
 return next(
   new ErrorHandler("Password is not matched with the new password", 400)
 );
}

user.password = req.body.password;

user.resetPasswordToken = undefined;
user.resetPasswordTime = undefined;

await user.save();

sendToken(user, 200, res);
});

//  Get user Details
exports.userDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
   
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("Old Password is incorrect", 400)
    );
  };

  if(req.body.newPassword  !== req.body.confirmPassword){
      return next(
          new ErrorHandler("Password not matched with each other", 400)
        );
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user,200,res);
});



//Update User Profile

exports.updateProfile = catchAsyncError(async(req,res,next) =>{
  const newUserData = {
      name: req.body.name,
      email: req.body.email,
  };

 if (req.body.avatar !== "") {
  const user = await User.findById(req.user.id);

  const imageId = user.cloudinary_id;

  await cloudinary.uploader.destroy(imageId);

  const  result = await cloudinary.uploader.upload(req.file.path);
  newUserData.avatar = {
    public_id: result.secure_url,
    cloudinary_id:result.public_id
  };
}

const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
  new: true,
  runValidator: true,
  useFindAndModify: false,
});

res.status(200).json({
  success: true,
});
});


// Update User Profile
exports.updateProfile = catchAsyncError(async(req,res,next) =>{
  try {
    let user = await User.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      avatar: result?.secure_url || user.avatar,
      cloudinary_id: result?.public_id || user.cloudinary_id,
    };
    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

// Get All users ---Admin
exports.getAllUsers = catchAsyncError(async (req,res,next) =>{
  const users = await User.find();

  res.status(200).json({
      success: true,
      users,
  });
});

// Get Single User Details ---Admin
exports.getSingleUser = catchAsyncError(async (req,res,next) =>{
  const user = await User.findById(req.params.id);
 
  if(!user){
      return next(new ErrorHandler("User is not found with this id",400));
  }

  res.status(200).json({
      success: true,
      user,
  });
});

// Change user Role --Admin
exports.updateUserRole = catchAsyncError(async(req,res,next) =>{
  const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id,newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
  });

  res.status(200).json({
      success: true,
      user
  })
});

// Delete User ---Admin
exports.deleteUser = catchAsyncError(async(req,res,next) =>{

 const user = await User.findById(req.params.id);

 const imageId = user.cloudinary_id;

 await cloudinary.uploader.destroy(imageId);

  if(!user){
      return next(new ErrorHandler("User is not found with this id",400));
  }

  await user.remove();

  res.status(200).json({
      success: true,
      message:"User deleted successfully"
  })
});