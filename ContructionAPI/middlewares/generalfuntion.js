const bcrypts = require('bcryptjs');
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require("../configs/Const")

const hashPassword = async (textString) => {
	const salt = await bcrypts.genSalt(15);
	return await bcrypts.hash(textString, salt);
};

const isCompare = async (password, passwordCompare) => {
    try {
        return await bcrypts.compare(password, passwordCompare)
    } catch (error) {
        throw new Error(error)
    }
}

const encodedToken = (userID, time) => {
    return JWT.sign({
        iss: 'Mai Tuong',
        sub: userID
    }, JWT_SECRET, { expiresIn: time })
}

const isAccess = async(account) =>{
    return await account.role <2;
}

const isAdmin = async(account) => {
    return await (account.role==0)?true:false;
}
module.exports ={
    hashPassword,
    isCompare,
    encodedToken, 
    isAccess, 
    isAdmin
}