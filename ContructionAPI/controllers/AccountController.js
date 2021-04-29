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
        ],
      });
      console.log(account);
      if (!account)
        return res.status(404).json({
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
      return res.status(403).json({
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
  let size = 5;
  let page = 0;
  if (req.query.size != undefined && req.query.size != '') {
    const number_limit = parseInt(req.query.size);
    if (number_limit && number_limit > 0) {
      size = number_limit;
    }
  }
  if (req.query.page != undefined && req.query.page != '') {
    const number_page = parseInt(req.query.page);
    if (number_page && number_page > 0) {
      page = number_page;
    }
  }
  let sort = {};
		if (req.query.sort != undefined && req.query.sort != '0') {
			sort['createdAt'] = req.query.sort == '1' ? 1 : -1;
		}

  const condition = {
    $and: [
      { org_code: { $regex: new RegExp("^" + req.user.org_code, "i") } },
      { org_code: { $ne: req.user.org_code } },
      { role: 1 },
    ],
  };

  const listUsers = await ACCOUNT.find(condition)
                                  .sort(sort)
                                  .limit(size)
                                  .skip(page*size);
  let count = await ACCOUNT.countDocuments(condition);

  return res.status(200).json({ success: true, code: 200, user: listUsers, size: size, page: page,total:count });
};

const updateInfoUser = async (req, res, next) => {
  if (isEmpty(req.body)) {
    return res
      .status(400)
      .json({ success: false, code: 400, message: "Body is required!" });
  } else {
    const { fullname, email, mobile, org_code } = req.body;
    const { userId } = req.params;
    let userFound = await ACCOUNT.findOne({ _id: userId });
    if (!userFound) {
      return res
        .status(400)
        .json({ success: false, code: 400, message: "User id is incorrect!" });
    } else if (userFound.role > 1  && ((req.user.role >= userFound.role) || (req.user.org_code != userFound.role))) {
      return res
        .status(400)
        .json({ success: false, code: 400, message: "User id is incorrect!" });
    } else {
      if (fullname) userFound.fullname = fullname;

      if (email) {
        if (await ACCOUNT.findOne({ email: email })) {
          return res
            .status(400)
            .json({
              success: false,
              code: 400,
              message: "Email already in use",
            });
        } else {
          userFound.email = email;
        }
      }

      if (mobile) {
        if (await ACCOUNT.findOne({ monile: mobile })) {
          return res
            .status(400)
            .json({
              success: false,
              code: 400,
              message: "Mobile already in use",
            });
        } else {
          userFound.mobile = mobile;
        }
      }

      //org_code is standarded by font
      if (org_code) userFound.org_code = org_code;

      //Update user make update
      userFound.modified_by = req.user._id;
      await userFound.save();

      userFound = userFound.toObject();
      await delete userFound.role;
      await delete userFound.password;
      return res
        .status(200)
        .json({
          success: true,
          code: 200,
          message: "update success",
          user: userFound,
        });
    }
  }
};
const findUserByMobileOrEmail = async (req, res, next) => {
  const {mobile,email} = req.query

  if(!mobile && !email) {return res.status(400).json({success:false,code:400,message:"Info searching is required!"});}
  else{
  const userFound = await ACCOUNT.findOne({$and:[{$or:[{mobile:mobile},{email:email}]},
    { org_code: { $regex: new RegExp("^" + req.user.org_code, "i") } },
    { org_code: { $ne: req.user.org_code } },
    { role: 1 },
  ]});
  return res.status(200).json({success:true,code:200,message:"",user:userFound})
  }
};

const findUserById = async (req, res, next) => {
  const {userId} = req.params
  let userFound = await ACCOUNT.findOne({ _id: userId, role: [0,1] });
    if (!userFound) {
      return res
        .status(400)
        .json({ success: false, code: 400, message: "User id is incorrect!" });
    } else if (req.user.role >= userFound.role) {
      return res
        .status(400)
        .json({ success: false, code: 400, message: "User id is incorrect!" });
    }
    else{
      userFound = userFound.toObject();
      delete userFound.role;
      delete userFound.password;
      return res.status(200).json({success:true,code:200, message:"", user:userFound});
    }
}


const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  const userFound = await ACCOUNT.findOne({_id:userId});
  if(!userFound){
    return res.status(400).json({success:false,code:400,message:"id is incorrect!"});
  }else if(req.user.role<=userFound.role){
    return res.status(403).json({success:false,code:403,message:"permission denied!"});
  }
  else{
    await ACCOUNT.findByIdAndDelete(userId);
    return res.status(200).json({success:true,code:200,message:"deleted"});
  }
};



function isEmpty(obj) { 
  for (var x in obj) { return false; }
  return true;
}

module.exports = {
  adminResetPasswordAll,
  signUpUser,
  signInUser,
  changePasswordAll,
  getListUser,
  updateInfoUser,
  deleteUser,
  findUserByMobileOrEmail,
  findUserById
};
