import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectdb from "./db/mongodb.js"
import adminRouter from "./routes/adminRoute.js"
const app=express();
const port=process.env.PORT ||8000

//middlewares
app.use(cors({

}))

app.use(express.json({
    limit:"16kb"     
}));

//api endpoints    

app.use("/api/v1/admin",adminRouter);


app.get('/',(req,res)=>{
 res.send("app is chaluu hai bh")    
})
connectdb()
.then (()=>{
    app.on("error",(error)=>{
        console.log("error in server",error)
        throw error;
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`our app is listening on the ${port}`)
    })
})
.catch((err)=>{
    console.log(err);   
})


app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});