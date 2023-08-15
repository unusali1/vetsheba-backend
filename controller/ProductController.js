const { ifError } = require("assert");
const { response } = require("../app.js");
const Product =require("../models/ProductModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncError");
const Features = require("../utils/Features.js");
const cloudinary = require("cloudinary");

//create product----admin
exports.createProduct = catchAsyncError(async(req,res,next) => {

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  })
  
});

//get All products
exports.getAllProducts =catchAsyncError(async(req,res)=>{
    const resultPerPage=8;
    const productsCount= await Product.countDocuments();
    const feature = new Features(Product.find(),req.query).search().filter().pagination(resultPerPage);
    const products = await feature.query;
   res.status(200).json({
    success:true,
    products,
    productsCount,
    resultPerPage
    
   })
});

//get All products
exports.getAllProductsAdmin =catchAsyncError(async(req,res)=>{
  const resultPerPage=8;
  const productCount= await Product.countDocuments();
  const feature = new Features(Product.find(),req.query)
 const products = await feature.query;
 res.status(200).json({
  success:true,
  products,
  
 })
});

//update product
exports.updateProduct = catchAsyncError(async(req,res,next) => {
 let product = await Product.findById(req.params.id);
 if(!product){
  return res.status(500).json({
    success:false,
    message: 'Product not found in the database'
  })
 }

 product = await Product.findByIdAndUpdate(req.params.id, req.body ,{
  new: true,
  runValidators: true,
  useUniField: false
 });
 res.status(200).json({
  success: true,
  product
 })
});

//delete product

exports.deleteProduct =catchAsyncError(async (req,res,next) => {
 const product = await Product.findById(req.params.id)
 if(!product){
  return next(new ErrorHandler("Product is not found this id",404));
 }

 await product.remove();
 res.status(200).json({success:true, message:"Product deleted successfully"});
});

//single product details
exports.getSingleProduct =catchAsyncError(async(req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product is not found this id",404));
       }
       res.status(200).json({
        success:true,
        product,
        
        });
});

// Create New Review or Update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numofReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.rating = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Get All reviews of a single product
  exports.getSingleProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHandler("Product is not found with this id", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  
  // Delete Review --Admin
  exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found with this id", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
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