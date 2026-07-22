
const pdfParse=require("pdf-parse")
const {generateInterviewReport}=require("../services/ai.service")
const interviewReportModel=require("../models/interviewReport.model")


async function generateInterviewController(req,res){
    const resumeContent=await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const {selfDescription,jobDescription}=req.body
    const interviewReportByAi= await generateInterviewReport({resumeContent,selfDescription,jobDescription})

    const interviewReport= await interviewReportModel.create({
        user:req.user.id,
        resumeText:resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    // console.log(interviewReportByAi)
    res.status(201).json({
        message:"Report Created Successfully",
        resumeText:resumeContent.text,
        selfDescription,
        jobDescription,
        interviewReportByAi
    })
}


module.exports={generateInterviewController}