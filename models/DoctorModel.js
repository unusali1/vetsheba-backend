const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const doctorSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: [true, "Please Enter a name of a product"],
        trim: true,
        maxlength: [50, "product must be at least 20 characters"],
    },
    email:{
        type: 'string',
        required: [true, "Please Enter a email address"],
        validate: [validator.isEmail, "please enter a valid email"],
        unique: true,
    },
   
    degree: {
        type: 'string',
        required: [true, "Please Enter a description of a product"],
        maxlength: [50, "Description must be greater than 4000 characters"],
    },
    university: {
        type: 'string',
        required: [true, "Please Enter a price of a product"],
        maxlength: [100, "Price must be greater than 10 characters"],
    },
    registration: {
        type: 'string',
        maxlength: [250, "Discount must be greater than 7 characters"],

    },
    location: {
        type: 'string',
    },
    category: {
        type: 'string',
    },
    nationality:{
      type: "string",
      default: "Bangladeshi"
    },
   images: {
        type: "string",
    },
    price:{
        type: "number",
        default: "500"
    },
    stock: {
        type: "number",
        default: 3,
    },
    availability:{
        type: "string",
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    
});


module.exports = mongoose.model("Doctor", doctorSchema);