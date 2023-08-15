const GetAppointment = require("../models/GetAppointmentModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const Doctor = require("../models/DoctorModel.js");
const catchAsyncError = require("../middleware/catchAsyncError");

// Create Appointment
exports.createAppointment = catchAsyncError(async (req,res,next) =>{

    const {
        AnimalInfo,
        getDoctor,
        paymentInfo,
        itemsPrice,
        totalPrice,
    } = req.body;

    const appointment= await GetAppointment.create({
        AnimalInfo,
        getDoctor,
        paymentInfo,
        itemsPrice,
        totalPrice,
        paidAt:Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        appointment
    });
});

//  Get Single order
exports.getSingleAppointment = catchAsyncError(async (req,res,next) =>{
    const appointment = await GetAppointment.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!appointment){
        return next(new ErrorHandler("Appointment not found with this id",404));
    }

    res.status(200).json({
        success: true,
        appointment
    });
});

// Get all orders
exports.getAllAppointments = catchAsyncError(async (req,res,next) =>{
    const appointments = await GetAppointment.find({user: req.user._id});
    res.status(200).json({
        success: true,
        appointments
    });
});

// Get All Appointments ---Admin
exports.getAdminAllAppointments = catchAsyncError(async (req,res,next) =>{
    const appointments = await GetAppointment.find();
    res.status(200).json({
        success: true,
        appointments
    });
});

// // update Order Status ---Admin
// exports.updateAdminOrder = catchAsyncError(async (req, res, next) => {

//     const order = await Order.findById(req.params.id);
  
//     if (!order) {
//       return next(new ErrorHandler("Order not found with this Id", 404));
//     }
  
//     if (order.orderStatus === "Delivered") {
//       return next(new ErrorHandler("You have already delivered this order", 400));
//     }
  
//     if (req.body.status === "Shipped") {
//       order.orderItems.forEach(async (o) => {
//         await updateStock(o._id, o.quantity);
//       });
//     }
//     order.orderStatus = req.body.status;
  
//     if (req.body.status === "Delivered") {
//       order.deliveredAt = Date.now();
//     }
  
//     await order.save({ validateBeforeSave: false });
//     res.status(200).json({
//       success: true,
//     });
//   });
  
//   async function updateStock(id, quantity) {
      
//     const product = await Product.findById(id);
  
//     product.stock -= quantity;
  
//     await product.save({ validateBeforeSave: false });
//   }


// delete Order ---Admin
exports.deleteAppointment = catchAsyncError(async (req,res,next) =>{

    const appointment = await GetAppointment.findById(req.params.id);
    
    if(!appointment){
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    await appointment.remove();

    res.status(200).json({
        success: true,
    });
});