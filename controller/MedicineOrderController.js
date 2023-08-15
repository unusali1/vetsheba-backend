const MedicineOrder = require("../models/MedicineOrederModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const Medicine = require("../models/MdecineModel");
const catchAsyncError = require("../middleware/catchAsyncError");

// Create Order
exports.createMdecineOrder = catchAsyncError(async (req, res, next) => {

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const medicineorder = await MedicineOrder.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    medicineorder
  });
});

//  Get Single order
exports.getSingleMedicineOrder = catchAsyncError(async (req, res, next) => {
  const medicineorder = await MedicineOrder.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!medicineorder) {
    return next(new ErrorHandler("Order not found with this id", 404));
  }

  res.status(200).json({
    success: true,
    medicineorder
  });
});

// Get all orders
exports.getAllMedicineOrders = catchAsyncError(async (req, res, next) => {
  const medicineorders = await MedicineOrder.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    medicineorders
  });
});

// Get All orders ---Admin
exports.getAdminMedicineAllOrders = catchAsyncError(async (req, res, next) => {
  const medicineorders = await MedicineOrder.find();

  let totalAmount = 0;

  medicineorders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    medicineorders
  });
});

// update Order Status ---Admin
exports.updateAdminMedicineOrder = catchAsyncError(async (req, res, next) => {

  const medicineorder = await MedicineOrder.findById(req.params.id);

  if (!medicineorder) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (medicineorder.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    medicineorder.orderItems.forEach(async (o) => {
      await updateStock(o.pid, o.quantity);
    });
  }
  medicineorder.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await medicineorder.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {


  const medicine = await Medicine.findById(id);
  medicine.stock -= quantity;

  await medicine.save({ validateBeforeSave: false });
}


// delete Order ---Admin
exports.deleteMedicineOrder = catchAsyncError(async (req, res, next) => {

  const medicineorder = await MedicineOrder.findById(req.params.id);

  if (!medicineorder) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await medicineorder.remove();

  res.status(200).json({
    success: true,
  });
});