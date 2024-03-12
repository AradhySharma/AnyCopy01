const User =require("../models/User");
require("dotenv").config();
const jwt=require("jsonwebtoken");

exports.auth = async function(req, res, next){
    // Get the token from the request header
    const token = req.header('x-api-key');
    console.log(token)
    console.log("lucky")

    // If token not provided, return error
    if (!token) {
        return res.status(401).send({ status: false, msg: 'Unauthorized' });
    }

    // Verify the token
    const decoded = jwt.verify(token, "Secretkey"); // Replace with your own JWT secret

    // Find user by ID from the decoded token
    const user = await User.findById(decoded.userId);

    // If user not found, return error
    if (!user) {
        return res.status(401).send({ status: false, msg: 'Unauthorized' });
    }

    // Attach the user object to the request for further use
    req.user = user;
    next(); // Call the next middleware
}

