const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const ApiFeatures = require("../utils/apifeatures")



//create Product -- admin
exports.createProduct = catchAsyncErrors(async (req,res,next) => {
    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.status(201).json({
        success:true,
        product
    })
})

// Get all Products 

exports.getAllProducts = catchAsyncErrors(async(req,res,next) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments()

   const apiFeatures = new ApiFeatures(Product.find(),req.query)
   .search()
   .filter().pagination(resultPerPage)


    const products = await apiFeatures.query

    res.status(200).json({
        success:true,
        products,
        productCount
    })
})

//Get Product details
exports.getProductDetails = catchAsyncErrors( async(req,res,next) => {

    
    const product = await Product.findById(req.params.id)
    
    if(!product){
        
        return next(new ErrorHandler("Product Not Found",404))
        }
    
    
    res.status(200).json({
        success: true,
        product
    })
})


// Update Product -- admin

exports.updateProduct = catchAsyncErrors(async (req,res,next) => {
    
    let product = await Product.findById(req.params.id)

    if(!product){
        return res.status(500).json({                    // return is used to come out of scope
            success: false,
            message: "product not found"
    })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})

// DELETE PRODUCT

exports.deleteProduct = catchAsyncErrors(async (req,res,next) => {

    const product = await Product.findById(req.params.id)

    if(!product){
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }


    await product.deleteOne({_id: req.params.id})
    res.status(200).json({
        sucess: true,
        message: "Product deleted succesfully"
    })

})


// Create new review or update review
exports.createProductReview = catchAsyncErrors( async(req,res,next) => {

    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)

    if(product) {
        const alreadyReviwed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString()
        )

        if(alreadyReviwed){
            return next(new ErrorHandler("Product already reviwed"),400)
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)

        product.numofReviews = product.reviews.length

        let avg =0;

        product.reviews.forEach((rev) => {
                avg += rev.rating
            }) 
        
         product.ratings = avg / product.reviews.length

        // product.rating = 
        //    product.reviews.reduce((acc, item) => item.rating + acc,0) /
        //    product.reviews.length

        await product.save()
        res.status(201).json({
            sucess: true,
            message: "review added"
        })
    }else{
        return next(new ErrorHandler(" Product not found"),404)
    }




    // const review = {
    //     user: req.user._id,
    //     name: req.user.name,
    //     rating: Number(rating),
    //     comment
    // }

    // const product = await Product.findById(productId)

    // const isReviwed =  await product.reviews.find(
    //     (rev) => rev.user.toString() == rev.user._id.toString()
    // );

    // if(isReviwed){
    //     product.reviews.forEach((rev) =>{
    //         if(rev.user.toString() == rev.user._id.toString())
    //         (rev.rating = rating),(rev.comment = comment)
    //     })
    // }else{
    // product.reviews.push(review);
    // product.numofReviews = product.reviews.length;
    // }

    // let avg =0;

    // // product.ratings = product.reviews.forEach((rev) => {
    // //     avg += rev.rating
    // // }) / product.reviews.length;

    //  product.reviews.forEach((rev) => {
    //     avg += rev.rating
    // }) 

    // product.ratings = avg / product.reviews.length

    // await product.save( {validateBeforeSave: false});

    // res.status(200).json({
    //     sucess: true
    // })
})


// Get all reviews of a product
exports.getProductReviews = catchAsyncErrors( async(req,res,next) => {
    const product = await Product.findById(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found"),404)
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


// Delete Review
exports.deleteReview = catchAsyncErrors( async(req,res,next) => {
    const product = await Product.findById(req.query.productId)

    const reviews = product.reviews.filter(
        rev => rev._id.toString() !== req.query.id.toString()
    )
    if(!product){
        return next( new ErrorHandler("product not found"),404)
    }

    let avg =0;
    
    reviews.forEach((rev)=>{
        avg += rev.rating
    });

    const ratings = avg / reviews.length
    
    const numofReviews = reviews.length

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numofReviews
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        
        })

    res.status(200).json({
        success: true
    })

})