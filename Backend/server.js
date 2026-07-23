const app=require('./src/app')
require("dotenv").config()
const connectDB=require('./src/config/database')
// const {resumeText,selfDescription,jobDescription}=require("./src/services/temp")
// const {generateInterviewReport} =require("./src/services/ai.service")
// generateInterviewReport({resumeText,selfDescription,jobDescription})




connectDB()
  app.listen(process.env.PORT || 3000,()=>{
    console.log(`server is running on port ${process.env.PORT || 3000}`)
})