const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: [true, "Please Enter a name of a product"],
        trim: true,
        maxlength: [50, "product must be at least 20 characters"],
    },
    description: {
        type: 'string',
        required: [true, "Please Enter a description of a product"],
        maxlength: [4000, "Description must be greater than 4000 characters"],
    },
    price: {
        type: 'number',
        required: [true, "Please Enter a price of a product"],
        maxlength: [10, "Price must be greater than 10 characters"],
    },
    discountPrice: {
        type: 'string',
        maxlength: [7, "Discount must be greater than 7 characters"],

    },
    color: {
        type: 'string',
    },
    size: {
        type: 'string',
    },
    rating: {
        type: 'number',
        default: 0,
    },
    images: {
        type: "string",
    },
    brand: {
        type: "string",
        required: [true, "Please Enter a name of a product Brand"],
        trim: true,
        maxlength: [50, "product must be at least 20 characters"],

    },
    type: {
        type: "string",
        required: [true, "Please Enter a type of a product"],
        trim: true,
        maxlength: [50, "product must be at least 20 characters"]
    },
    packaging: {
        type: String,
        default: "PP Bags"
    },
    shelf: {
        type: String,
        default: "12 Months"
    },
    psize: {
        type: String,
        default: "50kg & 25kg"
    },
    category: {
        type: 'string',
        required: [true, "Please Enter a category of a product"],

    },
    stock: {
        type: 'number',
        required: [true, "Please Enter a stock of a product"],
        maxlength: [3, "Stock can not exced than 3 chracters"],
    },
    numofReviews: {
        type: 'number',
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",

            },
            name: {
                type: 'string',
                // required: true,
            },
            rating: {
                type: 'number',
                required: true,
            },
            comment: {
                type: 'string',

            },
            time: {
                type: 'Date',
                default: Date.now(),
            },
        },
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        // required: true

    },
    createdAt: {
        type: 'Date',
        default: Date.now(),
    }
});


module.exports = mongoose.model("Product", productSchema);