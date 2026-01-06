const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// generate secret key using HMAC algorithm
const access_key = process.env.ACCESS_KEY
const key = "Welcome to Nodejs"

// auth token secret
// const generateKey = () => {
//     return crypto.createHmac('sha1', key).update(access_key).digest('hex');
// }
const generateKey = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET not defined");
    }
    return process.env.JWT_SECRET;
}

// jwt token
const createAccessToken = async (payload) => {
    let secret_key = generateKey();
    return jwt.sign(payload, secret_key,{ expiresIn: '1d'}) // '1d', '2h', 5*60*1000
};

// cookies
const sendResponseWithCookie = ({ res, id }) => {
    let token = createAccessToken({ id })
    return token;
}


// validate token
const validateAuthToken = (token,res) => {
    let secret_key = generateKey();
   
    jwt.verify(token,secret_key, (err,response) => {
        if(err)
            return res.status(400).json({ msg: "Invalid Authentication..Invalid Auth Token.."})
       
        res.status(200).json({ authToken: token })
    })
}


//generate password token
const passwordToken = (payload) => {
    let secret_key = generateKey();
    let token = jwt.sign(payload, secret_key,{ expiresIn: 10 * 60}) // 10min
   return token;
}


module.exports = { createAccessToken, sendResponseWithCookie, validateAuthToken, generateKey, passwordToken }