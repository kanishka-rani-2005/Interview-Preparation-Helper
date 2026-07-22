const express=require("express")
const authRouter=express.Router()
const authController=require('../controllers/auth.controller')
const authMiddleware=require("../middlewares/auth.middleware")

/**
 * @route Post /api/auth/register
 * @description Register a new user 
 * @access public
 */
authRouter.post("/register",authController.registerUserController)

/**
 * @route Post /api/auth/login
 * @description Login user using email or username
 * @access public
 */
authRouter.post("/login", authController.loginUserController);


/**
 * @route POST /api/auth/logout
 * @description Logout User
 * @access public
 */
authRouter.post("/logout", authController.logoutUserController);


/**
 * @route GET /api/auth/get-me
 * @description GET CURRENT USER DETAILS
 * @access private
 */
authRouter.get("/get-me",authMiddleware.authUser, authController.GetUserController);


module.exports=authRouter

