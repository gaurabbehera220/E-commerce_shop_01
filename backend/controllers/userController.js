const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken")

exports.registerUser = catchAsyncErrors( async( req,res,next) => {
    const { name, email, password} = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id: "This is a sample Id",
            url: "ProfilePicUrl"
        }
    }); 

    sendToken(user,201,res)
 
})

//login user
exports.loginUser = catchAsyncErrors( async(req,res,next) => {
    const { email, password} = req.body

    //checking if the user has given email or password
    if(!email || !password){
        return next( new ErrorHandler("Please enter email or password",400))
    }

    const user = await User.findOne({ email }).select("+password")

    if(!user){
        return next( new ErrorHandler("Invalid Email or Password"),401)
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password"),401)
    }

    sendToken(user,200,res)
    
})
// Logout User
exports.logoutUser = catchAsyncErrors( async(req,res,next) => {
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});


// Get User details
exports.getUserDetails = catchAsyncErrors( async(req,res,next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
})


// Update User Password
exports.updatePassword = catchAsyncErrors( async(req,res,next) => {

    const user = await User.findById(req.user.id).select("password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if(!isPasswordMatched){
        return next( new ErrorHandler(" old Password is incorrect"),400)
    }

    if( req.body.newPassword != req.body.confirmPassword){
        return next(new ErrorHandler(" Password does not match"),400)
    }
    user.password =req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
})


// Update user profile
exports.updateProfile = catchAsyncErrors( async(req,res,next) => {
    const newUserdata = {
        name: req.body.name,
        email: req.body.email
    }

    //we will add cloudynary later

    const user = await User.findByIdAndUpdate(req.user.id,newUserdata,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

//Get all users(admin)
exports.getAlluser = catchAsyncErrors( async(req,res,next) => {
    const user = await User.find()

    res.status(200).json({
        success: true,
        user
    })
})


// Get Single User-- admin
exports.getSingleUser = catchAsyncErrors( async(req,res,next) => {

    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User dose not exists with id ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})


// Update user role
exports.updateUserRole = catchAsyncErrors( async(req,res,next) => {
    const newUserdata = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserdata,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})


// Delete user -- admin
exports.deleteUser = catchAsyncErrors( async(req,res,next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`user does not exists with id: ${req.params.id}`))
    }

    await user.deleteOne({_id: req.params.id})
    res.status(200).json({
        sucess: true,
        message: "User deleted succesfully"
    })
})