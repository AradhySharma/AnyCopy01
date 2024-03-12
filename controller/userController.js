const User = require("../models/User")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config();
const sgMail = require('@sendgrid/mail');
const randomstring = require('randomstring');

// Set up SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup=async(req,res)=>{
    try{
          const {full_name,CompanyName,email,password,confirmPassword,Company_Website,Industry,Bussiness_Size,
          Products,Description,Audience,Keywords}=req.body
         
          if(!full_name || !CompanyName || !email || !password ||!confirmPassword || !Company_Website || !Industry || !Bussiness_Size || !Products 
            || !Description || !Audience || !Keywords){
            return res.json({
                success:false,
                message:"All Fields Are Required"
            })
          }
        const dbChecking= await User.findOne({email});
       
        if(dbChecking){
            res.status(401).json({
                success:false,
                message:"User already exist try different email",
            })
        }
          
          if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"password and confirm password dose'nt match"
            })
          }
          const hashedPassword=await bcrypt.hash(password,10);
          //password hash
          const user=await User.create({
            full_name:full_name,
            email:email,
            CompanyName:CompanyName,
            password:hashedPassword,
            confirmPassword:hashedPassword,
            Company_Website:Company_Website,
            Industry:Industry,
            Bussiness_Size:Bussiness_Size,
            Products:Products,
            Description:Description,
            Audience:Audience,
            Keywords:Keywords
          })
          return res.json({
            success:true,
            message:user
          })
    } catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.login = async function(req,res){
  try{
  let data = req.body;
  let {email, password} = data;
  if(Object.keys(data).length == 0){
      return res.status(400).send({status:"false", message:"All fields are mandatory "});
  }
  if(!email){
      return res.status(400).send({status:false, message:"please enter email"})
  }
  if(!password){
      return res.status(400).send({status:false, message:"please enter password"})
  }
  let user = await User.findOne({email});
  if(!user){
      return res.status(404).send({status:false,message:"user not found"})
  }
  let cheakPassword = await bcrypt.compare(password, user.password);
  if(!cheakPassword){
      return res.status(401).send({status:false, message:"incorrect password"});
  }
  let token = jwt.sign({userId:user._id.toString()},process.env.JWT_SECRET)

  res.setHeader("x-api-key", token);
  return res.status(200).send({status:true, message:"logged in successfuly", "x-api-key": token});
}catch(error){
  return res.status(500).send({status:false, msg:error.message});
}
}

// Endpoint to send verification code to the old email
exports.sendCode = async (req, res) => {
  const { email } = req.body;

  // Generate verification code
  const verificationCode = randomstring.generate(6);

  // Send verification code to the old email
  try {
      await sendVerificationEmail(email, verificationCode);
      res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
      console.error('Error sending verification code:', error);
      res.status(500).json({ error: 'Failed to send verification code' });
  }
};

// Endpoint to verify the code and update the email
exports.updateEmail = async (req, res) => {
  const { email, verificationCode, newEmail } = req.body;

  try {
      if (!verificationCode) {
          return res.status(400).json({ error: 'Verification code is required' });
      }

      // Find the user by email and verify the verification code in a single database call
      const userData = await User.findOneAndUpdate(
          { email: email, verificationCode: verificationCode },
          { email: newEmail },
          { new: true }
      );

      if (!userData) {
          return res.status(400).json({ error: 'Invalid verification code' });
      }

      res.status(200).json({ message: 'Email address updated successfully' });
  } catch (error) {
      console.error('Error updating email address:', error);
      res.status(500).json({ error: 'Failed to update email address' });
  }
};

// Function to send verification code to the old email using SendGrid
async function sendVerificationEmail(email, code) {
  const msg = {
      to: email,
      from: 'your-email@example.com', // Change to your verified sender
      subject: 'Verification Code',
      text: `Your verification code is: ${code}`,
  };

  try {
      await sgMail.send(msg);
  } catch (error) {
      throw error;
  }
}

// API endpoint to update password
exports.updatePassword = async (req, res) => {
  const {oldPassword, newPassword } = req.body;
  const {_id}= req.user;

  try {
  
      // Find user by email
      let user = await User.findById(_id);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Verify old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Invalid old password' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password
      await User.findOneAndUpdate({userId_id: _id }, { password: hashedPassword },{ new: true });

      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Failed to update password' });
  }
};

