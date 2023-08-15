const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: [true, "Please Enter your name"],
        minlength: [3, "please enter a name atleast 3 characters"],
        maxlength: [15, "please enter a name atleast 15 characters"],
    },
    email: {
        type: 'string',
        required: [true, "Please Enter a email address"],
        validate: [validator.isEmail, "please enter a valid email"],
        unique: true,
    },
    password: {
        type: 'string',
        required: [true, "Please Enter a password"],
        minlength: [6, "Password must be at least 8 characters"],
        select: false,
    },
    avatar:{
        type: "string",
    },
    cloudinary_id :{
        type: "string",
    },
    role: {
        type: 'string',
        default: 'user',
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: 'string',
    resetPasswordTime: Date,
});

//Hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_SECRET_EXPIRES
    });
};

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Forgot password
userSchema.methods.getResetToken = function () {
    // Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //    hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordTime = Date.now() + 15 * 60 * 1000;

    return resetToken;
}; 

module.exports = mongoose.model("User", userSchema);