const mongoose = require("mongoose")
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please Enter Your Product Name"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxLength: [8,"Price cannot exceeed 8 character"]
    },
    ratings: {
        type: Number,
        default:0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true,"Please Enter Product Category"]
    },
    stock: {
        type: Number,
        required: [true, "Please Enter Product Stock"],
        maxLength:[4," Stock cannot exceed 4 character "],
        default:1
    },
    numofReviews: {
        type:Number,
        default:0
    },
    reviews: [
        {
            user :{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type:String,
                required: true  
            },
            rating : {
                type:Number,
                required: true
            },
            comment: {
                type:String,
                required: true
            }
        }
    ],
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt : {
        type:Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Product",productSchema)