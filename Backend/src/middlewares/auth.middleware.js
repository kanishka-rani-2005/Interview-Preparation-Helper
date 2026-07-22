const jwt=require("jsonwebtoken")
const TokenBlacklist=require('../models/blacklist.model')


async function authUser(req,res,next){
    const token = await req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"Token Not provided"
        })
    }
    const isTokenBlacklisted=await TokenBlacklist.findOne({token})
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"Token is inValid"
        })
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }
    catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }    
}
module.exports={authUser}