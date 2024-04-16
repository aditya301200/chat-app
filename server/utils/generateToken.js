// Package imports
import jwt from 'jsonwebtoken';

// Configurations
// configDotenv();

const generateTokenAndSetCookie = (userId, res) => {
    // generate jwt token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    // set cookie
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true, // prevent cookie access from client side javascript
        sameSite: "strict", // CSRF protection
        secure: process.env.NODE_ENV !== "development"
    })
    
}

export default generateTokenAndSetCookie;