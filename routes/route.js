const express = require("express");
const router = express.Router();
const{signup,login,updateEmail,updatePassword}=require("../controller/userController")
const {auth}=require("../midllewir/Auth")

//login and signup

router.post('/api/signup',signup);
router.post("/api/login",login);
router.patch("/api/emailchange",updateEmail);
router.patch("/api/passwordchange",auth,updatePassword);



module.exports = router;