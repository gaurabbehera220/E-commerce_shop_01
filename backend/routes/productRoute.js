const express = require("express")
const { getAllProducts, createProduct, updateProduct, deleteProduct, 
    getProductDetails, createProductReview, deleteReview, getProductReviews} = require("../controllers/productController")
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

router.route("/products").get(getAllProducts)

router.route("/admin/product/new")
.post(isAuthenticatedUser,authorizeRoles("admin"),createProduct)

router.route("/admin/product/:id")
.put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)

router.route("/product/:id").get(getProductDetails)

router.route("/product/:id/review").post(isAuthenticatedUser, createProductReview)
router.route("/product/:id/reviews")
.get(getProductReviews)
router.route("/reviews").delete(isAuthenticatedUser, deleteReview)

module.exports = router