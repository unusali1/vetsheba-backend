const { ifError } = require("assert");
const { response } = require("../app.js");
const Medicine =require("../models/MdecineModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError");
const Features = require("../utils/Features.js");
const cloudinary = require("cloudinary");

//create medicine----admin
exports.createMedicine = catchAsyncError(async(req,res,next) => {

  const medicine = await Medicine.create(req.body);

  res.status(201).json({
    success: true,
    medicine
  })
  
});

//get All Medicines
exports.getAllMedicine =catchAsyncError(async(req,res)=>{
    const resultPerPage=8;
    const medicineCount= await Medicine.countDocuments();
    const feature = new Features(Medicine.find(),req.query).search().filter().pagination(resultPerPage);
   const medicines = await feature.query;
   res.status(200).json({
    success:true,
    medicines,
    
   })
});

//get All Medicine
exports.getAllMedicinesAdmin =catchAsyncError(async(req,res)=>{
  const resultPerPage=8;
  const medicineCount= await Medicine.countDocuments();
  const feature = new Features(Medicine.find(),req.query)
 const medicines = await feature.query;
 res.status(200).json({
  success:true,
  medicines,
  
 })
});

//update medicine
exports.updateMedicine = catchAsyncError(async(req,res,next) => {
 let medicine = await Medicine.findById(req.params.id);
 if(!medicine){
  return res.status(500).json({
    success:false,
    message: 'Medicine not found in the database'
  })
 }

 medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body ,{
  new: true,
  runValidators: true,
  useUniField: false
 });
 res.status(200).json({
  success: true,
  medicine
 })
});

//delete medicine

exports.deleteMedicine =catchAsyncError(async (req,res,next) => {
 const medicine = await Medicine.findById(req.params.id)
 if(!medicine){
  return next(new ErrorHandler("Medicine is not found this id",404));
 }

 await medicine.remove();
 res.status(200).json({success:true, message:"Medicine deleted successfully"});
});

//single medicine details
exports.getSingleMedicine =catchAsyncError(async(req,res,next) => {
    const medicine = await Medicine.findById(req.params.id);
    if(!medicine){
        return next(new ErrorHandler("Medicine is not found this id",404));
       }
       res.status(200).json({
        success:true,
        medicine,
        
        });
});

// Create New Review or Update the review
exports.createMedicineReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, medicineId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const medicine = await Medicine.findById(medicineId);
  
    const isReviewed = medicine.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      medicine.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      medicine.reviews.push(review);
      medicine.numofReviews = medicine.reviews.length;
    }
  
    let avg = 0;
  
    medicine.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    medicine.rating = avg / medicine.reviews.length;
  
    await medicine.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Get All reviews of a single medicine
  exports.getSingleMedicineReviews = catchAsyncError(async (req, res, next) => {
    const medicine = await Medicine.findById(req.params.id);
  
    if (!medicine) {
      return next(new ErrorHandler("Medicine is not found with this id", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: medicine.reviews,
    });
  });
  
  // Delete Review --Admin
  exports.deleteMedicineReview = catchAsyncError(async (req, res, next) => {
    const medicine = await Medicine.findById(req.query.medicineId);
  
    if (!medicine) {
      return next(new ErrorHandler("Medicine not found with this id", 404));
    }
  
    const reviews = medicine.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let rating = 0;
  
    if (reviews.length === 0) {
      rating = 0;
    } else {
      rating = avg / reviews.length;
    }
  
    const numofReviews = reviews.length;
  
    await Medicine.findByIdAndUpdate(
      req.query.medicineId,
      {
        reviews,
        rating,
        numofReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });