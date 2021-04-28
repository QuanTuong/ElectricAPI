const { response } = require("express");
const ACCOUNT = require("../entities/S_ACCOUNT");
const generalSer = require("../middlewares/generalfuntion");

//Create funtion Admin reset password for Account
const adminResetPasswordAll = async (req, res, next) => {
  try {
    if (generalSer.isAdmin(req.user)) {
      const account = await ACCOUNT.findOne({
        $or: [
          { account_name: req.headers.account_name },
          { email: req.headers.email },
          { mobile: req.headers.mobile },
        ]
      });
      console.log(account);
      if (!account)
        return res
          .status(404)
          .json({
            success: false,
            code: 404,
            message: "Can not find user reset",
          });
      else {
        account.password = await generalSer.hashPassword(account.account_name);
        account.modified_by = await req.user.account_name;
		account.status = 0;
        await account.save();
        return res
          .status(200)
          .json({ success: true, code: 200, message: "reset success" });
      }
    } else {
      return res
        .status(403)
        .json({
          success: false,
          code: 403,
          message: "Permission denied! Required Admin role",
        });
    }
  } catch (error) {}
};

//Only owner can change the password
const changePasswordAll = async (req, res, next) => {
  try {
    const { password, new_password } = req.body;
    if (!password)
      return res
        .status(200)
        .json({ success: false, code: 400, message: "Pls insert old pwd" });
    if (!new_password)
      return res
        .status(200)
        .json({ success: false, code: 400, message: "Pls insert new pwd" });
    if (password == new_password)
      return res
        .status(200)
        .json({ success: false, code: 400, message: "New pwd is incorrectly" });

    const user = await ACCOUNT.findById(req.user._id);
    const isCompare = generalSer.isCompare(password, user.password);
    if (!isCompare)
      return res
        .status(200)
        .json({ success: false, code: 400, message: "Old pwd is incorrect" });
    else {
      user.password = await generalSer.hashPassword(new_password);
      user.modified_by = user.account_name;
      await user.save();
      return res
        .status(200)
        .json({ success: true, code: 200, message: "Password change" });
    }
  } catch (error) {
    next(error);
  }
};

//did not check org_code
// defautl value of role = 1 
// Only use to add new User using for Web
const signUpUser = async (req, res, next) => {
  try {
    const newUser = new ACCOUNT(req.body);
      const checkExist = await ACCOUNT.findOne({
        $or: [
          { account_name: newUser.account_name },
          { email: newUser.email },
          { mobile: newUser.mobile },
        ],
      });
      if (checkExist) {
        const user = checkExist.toObject();
        delete user.password;
        delete user.role;
        return res.status(400).json({
          success: false,
          code: 400,
          message: "account already exist",
          account: user,
        });
      } else {
        newUser.password = await generalSer.hashPassword(req.body.account_name);
        newUser.status = 0;
        newUser.role = 1;

        newUser.modified_by = req.user.account_name;
        newUser.created_by = req.user.account_name;

        console.log(newUser);

        newUser.save();
        return res.status(200).json({
          success: true,
          code: 201,
          message: "add user succesfully",
        });
      }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const signInUser = async (req, res, next) => {
  try {
    const token = "Bearer " + generalSer.encodedToken(req.user._id, "12h");
    res.setHeader("Authorization", token);
    const user = req.user.toObject();
    delete user.password;
    delete user.role;
    if (user.status == 0) {
      return res.status(200).json({
        success: true,
        code: 200,
        message: "The first login, must change password",
        user: user,
        redirectURL: "/pwd/change",
      });
    } else if (user.status == 2) {
      return res
        .status(403)
        .json({ success: false, code: 403, message: "Access denied" });
    } else {
      return res
        .status(200)
        .json({ success: true, code: 200, message: "", user: user });
    }
  } catch (error) {
    next(error);
  }
};

const getListUser = async (req, res, next) => {

  console.log(req.user.org_code);
  const condition ={$and: [{org_code:{$regex:new RegExp('^'+req.user.org_code, 'i')}},{role: 1}]} ;
  console.log(condition);
  
  const listUsers = await ACCOUNT.find(condition);

  return res.status(200).json({success: true, code: 200, user: listUsers});
}

module.exports = {
  adminResetPasswordAll,
  signUpUser,
  signInUser,
  changePasswordAll,
  getListUser
};
