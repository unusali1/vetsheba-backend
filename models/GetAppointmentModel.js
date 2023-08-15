const mongoose = require("mongoose");

const getAppointmentSchema = new mongoose.Schema({
  Date: {
    date: {
      type: String,
      default: new Date().toISOString().split('T')[0]
    },
    time: {
      type: String,
      
    },
  },
  AnimalInfo: {
    address: {
      type: String,
      //required: true,
    },
    animal: {
      type: String,
      //  required: true,
    },
    problem: {
      type: String,
      //  required: true,
    },
    age: {
      type: Number,
    },
   phone: {
      type: Number,
      //  required: true,
    },
    image: {
      type: String,
      //  required: true,
    },
  },
  getDoctor: [
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
        // required: true,
      },
      image: {
        type: String,
        //required: true,
      },
      stock: {
        type: Number,
        //required: true,
      },
      location: {
        type: String,
        //required: true,
      },
      doctorId: {
        type: mongoose.Schema.ObjectId,
        ref: "Doctor",
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
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },

  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GetAppointment", getAppointmentSchema);