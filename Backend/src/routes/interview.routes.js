const express=require("express")
const authMiddleware=require("../middlewares/auth.middleware")
const interviewRouter=express.Router()
const interviewController=require("../controllers/interview.controller")
const upload=require("../middlewares/file.middleware")




/**
 * @route POST /api/interview
 * @description genetrate new interview report on the basis od user self secription, job description,resume pdf
 * @access private
 */

interviewRouter.post('/',authMiddleware.authUser,upload.single("resumeText"),interviewController.generateInterviewController)

module.exports=interviewRouter