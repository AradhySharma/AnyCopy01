const express = require('express');
// const{signup,login}=require("./controller/Auths")
require("dotenv").config();
const route = require('./routes/route.js');
const mongoose = require("mongoose")

const app = express();
app.use(express.json());

app.use('/', route);



//login and signup

// app.post('/signup',signup);
// app.post("/login",login);

const port=process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.get("/",(req,res)=>{
    return res.json({
    success:true,
    message:'Your server is up and running....'
  });
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});