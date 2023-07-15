const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")

exports.newOrder = catchAsyncErrors( async(req,res,next) => {
    const { 
        shippingInfo ,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice

    } = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(200).json({
        success: true,
        order
    })
})


// Get Single order
exports.getSingleOrder = catchAsyncErrors( async(req,res,next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next( new ErrorHandler(" Order not found with this ID"),404)
    }

    res.status(200).json({
        success: true,
        order
    })
});


// get logged in user Orders
exports.myOrders = catchAsyncErrors( async( req,res,next) => {
    const orders = await Order.find({ user: req.user._id})

    res.status(200).json({
        success: true,
        orders
    })
});



// Get All Orders -- admin
exports.getAllOrders = catchAsyncErrors( async( req,res,next) => {
    const orders = await Order.find()

    let totalAmount = 0

    orders.forEach( (order) => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
});



// Update order status -- admin
exports.updateOrder = catchAsyncErrors( async(req,res,next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next( new ErrorHandler(" Order not found with this id"))
    }

    if(order.orderStatus === "Delivered"){
        return next( new ErrorHandler(" Product already Delivered"),404)
    }

    order.orderItems.forEach( async(o) => {
        await updateStock( o.product, o.quantity)
    })

    order.orderStatus = req.body.status

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now()
    }

    await order.save({ validateBeforeSave: false})
    res.status(200).json({
        success: true
    })
});


async function updateStock(id,quantity){
    const product = await Product.findById(id)

    product.stock -= quantity
    
    await product.save({ validateBeforeSave: false})
};



// Delete order -- admin
exports.deleteOrder = catchAsyncErrors( async(req,res,next) => {
    const order = await Order.findById(req.params.id)

    if(!order){
        return next( new ErrorHandler(" Order not found with this id"))
    }

    await order.deleteOne({_id: req.params.id})

    res.status(200).json({
        success : true,
    })
});