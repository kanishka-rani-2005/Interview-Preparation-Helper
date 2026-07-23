const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const TokenBlacklist=require('../models/blacklist.model')
/**
 * @route POST /api/auth/register
 * @description Register User
 */

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password",
            });
        }

        // Check if user already exists
        const isUserExist = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (isUserExist) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET
        );
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });
        
        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
/**
 * @route POST /api/auth/login
 * @description Login User
 */

async function loginUserController(req, res) {
    try {
        const { username,email, password } = req.body;

        // Validate input
        if (!username && !email || !password) {
            return res.status(400).json({
                message: "Please provide username/email and password",
            });
        }

        // Find user by email or username
        const user = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid username/email or password",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid username/email or password",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET
        );

        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });

        // Remove password
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "User login successful",
            user: userResponse,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}



/**
 * @route POST /api/auth/logout
 * @description Logout User
 */

async function logoutUserController(req, res) {
    try {
        const token=req.cookies.token
        if(token){
            await TokenBlacklist.create({token})
        }
        res.clearCookie("token")
        return res.status(200).json({
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}



async function GetUserController(req,res){

    const user=await userModel.findById(req.user.id)

    if(!user){
        return res.status(401).json({message:"error in getting info"})
    }

    res.status(200).json({
        message:"user detail fetch successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

module.exports = { registerUserController ,loginUserController , logoutUserController,GetUserController };