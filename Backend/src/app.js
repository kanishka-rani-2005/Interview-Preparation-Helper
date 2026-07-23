const express=require('express')
// require all the routes here
const authRouter=require('./routes/auth.routes')
const interviewRouter=require('./routes/interview.routes')
const cookieParser = require("cookie-parser");
const cors=require("cors")


const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));


//using all the routes here
app.use('/api/auth',authRouter)
app.use('/api/interview',interviewRouter)

module.exports=app