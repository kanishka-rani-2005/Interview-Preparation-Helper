const express=require("express")
const authMiddleware=require("../middlewares/auth.middleware")
const interviewRouter=express.Router()
const interviewController=require("../controllers/interview.controller")
const upload=require("../middlewares/file.middleware")




/**
 * @route POST /api/interview
 * @description genetrate new interview report on the basis of user self secription, job description,resume pdf
 * @access private
 */

interviewRouter.post('/',authMiddleware.authUser,upload.single("resumeText"),interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/id
 * @description get interview report by interviewId
 * @access private
 */

interviewRouter.get('/report/:interviewId',authMiddleware.authUser,interviewController.getInterviewReportByIdController)


/**
 * @route GET /api/interview/
 * @description get all interview report of logged in user
 * @access private
 */

interviewRouter.get('/',authMiddleware.authUser,interviewController.getAllInterviewReportsController)


/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description.
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)


module.exports=interviewRouter