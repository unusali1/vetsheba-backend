const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    house: {
      type: String,
      required: true,
    },
    road: {
      type: String,
      //  required: true,
    },
    village: {
      type: String,
      required: true,
    },
    postoffce: {
      type: String,
      required: true,
    },
    upozilla: {
      type:  String,
      //  required: true,
    },
    zilla: {
      type: String,
      //  required: true,
    },
    phoneNo: {
      type: Number,
     required: true,
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        //required: true,
      },
      price: {
        type: Number,
        //required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        //required: true,
      },
      stock: {
        type: Number,
        //required: true,
      },
      pid: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        //required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);