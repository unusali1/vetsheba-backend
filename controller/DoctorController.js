const Doctor =require("../models/DoctorModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError");
const Features = require("../utils/Features.js");



// Register Doctor
exports.createDoctor = catchAsyncError(async (req, res, next) => {
  const doctor = await Doctor.create(req.body);

  res.status(201).json({
    success: true,
    doctor
  })
});



//get All Doctors
exports.getAllDoctors =catchAsyncError(async(req,res)=>{
    const resultPerPage=8;
    const doctorCount= await Doctor.countDocuments();
    const feature = new Features(Doctor.find(),req.query).search().filter().pagination(resultPerPage);
    const doctors = await feature.query;
   res.status(200).json({
    success:true,
    doctors,
    
   })
});

//get All Doctors---------Admin
exports.getAllDoctorsAdmin =catchAsyncError(async(req,res)=>{
  const resultPerPage=8;
  const doctorCount= await Doctor.countDocuments();
  const feature = new Features(Doctor.find(),req.query)
 const doctors = await feature.query;
 res.status(200).json({
  success:true,
  doctors,
  
 })
});

//update product
exports.updatDoctor = catchAsyncError(async(req,res,next) => {
 let doctor = await Doctor.findById(req.params.id);
 if(!doctor){
  return res.status(500).json({
    success:false,
    message: 'Doctor not found in the database'
  })
 }


 doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body ,{
  new: true,
  runValidators: true,
  useUniField: false
 });
 res.status(200).json({
  success: true,
  doctor
 })
});

//delete Doctor ----admin

exports.deleteDoctor =catchAsyncError(async (req,res,next) => {
 const doctor = await Doctor.findById(req.params.id)
 if(!doctor){
  return next(new ErrorHandler("Doctor is not found this id",404));
 }

 await doctor.remove();
 res.status(200).json({success:true, message:"Doctor deleted successfully"});
});


//single doctor details
exports.getSingleDoctor =catchAsyncError(async(req,res,next) => {
    const doctor = await Doctor.findById(req.params.id);
    if(!doctor){
        return next(new ErrorHandler("Doctor is not found this id",404));
       }
       res.status(200).json({
        success:true,
        doctor,
        
        });
});


  
  
 






// //Login Doctor

// exports.loginDoctor =catchAsyncError(async(req,res,next)=>{
//     const {email,password} = req.body;
//     if(!email || !password){
//         return next(new ErrorHandler("please enter your email and password",400));

//     }
//     const doctor =await Doctor.findOne({email}).select("+password");
//     if(!doctor){
//         return next(new ErrorHandler("Doctor is not found with this email & password",401));

//     }
//     const isPasswordMatched = await doctor.comparePassword(password);
//     if(!isPasswordMatched){
//         return next(new ErrorHandler("Doctor is not found with this email & password",401));
//     }
 
//     sendToken(doctor,201,res);

// });

// //logout Doctor
// exports.logoutDoctor = catchAsyncError( (req, res, next) => {
//     res.cookie("token", null, {
//       expires: new Date(Date.now()),
//       httpOnly: true,
//     });
  
//     res.status(200).json({
//       success: true,
//       message: "Log out success",
//     });
//   });

// //Forget password
// exports.forgotPasswordDoctor = catchAsyncError(async (req, res, next) => {
//     const doctor = await Doctor.findOne({ email: req.body.email });
  
//     if (!doctor) {
//       return next(new ErrorHandler("Doctor not found with this email", 404));
//     }
  
//     // Get ResetPassword Token
  
//     const resetToken = doctor.getResetToken();
  
//     await doctor.save({
//       validateBeforeSave: false,
//     });
  
//     const resetPasswordUrl = `${req.protocol}://${req.get(
//       "host"
//     )}/password/reset/${resetToken}`;
  
//     const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;
  
//     try {
//       await sendMail({
//         email: doctor.email,
//         subject: `OVAFOS Password Recovery`,
//         message,
//       });
  
//       res.status(200).json({
//         success: true,
//         message: `Email sent to ${doctor.email} succesfully`,
//       });
//     } catch (error) {
//       doctor.resetPasswordToken = undefined;
//       doctor.resetPasswordTime = undefined;
  
//       await doctor.save({
//         validateBeforeSave: false,
//       });
  
//       return next(new ErrorHandler(error.message, 500));
//     }
//   });

//  //Reset Password
//  exports.resetPasswordDoctor = catchAsyncError(async (req, res, next) => {
//   // Create Token hash

//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const doctor = await Doctor.findOne({
//     resetPasswordToken,
//     resetPasswordTime: { $gt: Date.now() },
//   });

//   if (!doctor) {
//     return next(
//       new ErrorHandler("Reset password url is invalid or has been expired", 400)
//     );
//   }

//   if (req.body.password !== req.body.confirmPassword) {
//     return next(
//       new ErrorHandler("Password is not matched with the new password", 400)
//     );
//   }

//   doctor.password = req.body.password;

//   doctor.resetPasswordToken = undefined;
//   doctor.resetPasswordTime = undefined;

//   await doctor.save();

//   sendToken(doctor, 200, res);
// });

// //  Get doctor Details
// exports.doctorDetails = catchAsyncError(async (req, res, next) => {
//   const doctor = await Doctor.findById(req.doctor.id);

//   res.status(200).json({
//     success: true,
//     doctor,
//   });
// });

// // Update doctor Password
// exports.updatePasswordDoctor = catchAsyncError(async (req, res, next) => {
   
//   const doctor = await Doctor.findById(req.doctor.id).select("+password");

//   const isPasswordMatched = await doctor.comparePassword(req.body.oldPassword);

//   if (!isPasswordMatched) {
//     return next(
//       new ErrorHandler("Old Password is incorrect", 400)
//     );
//   };

//   if(req.body.newPassword  !== req.body.confirmPassword){
//       return next(
//           new ErrorHandler("Password not matched with each other", 400)
//         );
//   }

//   doctor.password = req.body.newPassword;

//   await doctor.save();

//   sendToken(doctor,200,res);
// });

// // //Update User Profile

// // exports.updateProfile = catchAsyncError(async(req,res,next) =>{
// //   const newUserData = {
// //       name: req.body.name,
// //       email: req.body.email,
// //   };

// //  if (req.body.avatar !== "") {
// //   const user = await User.findById(req.user.id);

// //   const imageId = user.cloudinary_id;

// //   await cloudinary.uploader.destroy(imageId);

// //   const  result = await cloudinary.uploader.upload(req.file.path);
// //   newUserData.avatar = {
// //     public_id: result.secure_url,
// //     cloudinary_id:result.public_id
// //   };
// // }

// // const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
// //   new: true,
// //   runValidator: true,
// //   useFindAndModify: false,
// // });

// // res.status(200).json({
// //   success: true,
// // });
// // });


// // // Update User Profile
// // exports.updateProfile = catchAsyncError(async(req,res,next) =>{
// //   try {
// //     let user = await User.findById(req.params.id);
// //     // Delete image from cloudinary
// //     await cloudinary.uploader.destroy(user.cloudinary_id);
// //     // Upload image to cloudinary
// //     let result;
// //     if (req.file) {
// //       result = await cloudinary.uploader.upload(req.file.path);
// //     }
// //     const data = {
// //       name: req.body.name || user.name,
// //       email: req.body.email || user.email,
// //       avatar: result?.secure_url || user.avatar,
// //       cloudinary_id: result?.public_id || user.cloudinary_id,
// //     };
// //     user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
// //     res.json(user);
// //   } catch (err) {
// //     console.log(err);
// //   }
// // });



// // Get All Doctors ---Admin
// exports.getAllDoctors = catchAsyncError(async (req,res,next) =>{
//   const resultPerPage=8;
//     const productCount= await Doctor.countDocuments();
//     const feature = new Features(Doctor.find(),req.query).search().filter().pagination(resultPerPage);
//     const doctors = await feature.query;
//    res.status(200).json({
//     success:true,
//     doctors,
    
//    })
// });

// // Get Single Doctor Details ---Admin
// exports.getSingleDoctor = catchAsyncError(async (req,res,next) =>{
//   const doctor = await Doctor.findById(req.params.id);
//   if(!doctor){
//       return next(new ErrorHandler("Doctor is not found this id",404));
//      }
//      res.status(200).json({
//       success:true,
//       doctor,
      
//       });
// });

// // Change Doctor Role --Admin
// exports.updateDoctorRole = catchAsyncError(async(req,res,next) =>{
//   const newDoctorData = {
//       name: req.body.name,
//       email: req.body.email,
//       role: req.body.role,
//   };
//   const doctor = await Doctor.findByIdAndUpdate(req.params.id,newDoctorData, {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//   });

//   res.status(200).json({
//       success: true,
//       doctor
//   })
// });

// // Delete Doctor ---Admin
// exports.deleteDoctor = catchAsyncError(async(req,res,next) =>{

//  const doctor = await Doctor.findById(req.params.id);

//  const imageId = doctor.cloudinary_id;

//  await cloudinary.uploader.destroy(imageId);

//   if(!doctor){
//       return next(new ErrorHandler("Doctor is not found with this id",400));
//   }

//   await doctor.remove();

//   res.status(200).json({
//       success: true,
//       message:"Doctor deleted successfully"
//   })
// });