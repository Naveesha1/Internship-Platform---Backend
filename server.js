import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'


//app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

// api endpoints
app.use("/api/user",userRouter)

app.get("/",(req,res)=>{
    res.send("Back end is running")
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    
})