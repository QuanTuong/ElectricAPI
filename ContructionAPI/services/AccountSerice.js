const { response } = require("express");
const ACCOUNT = require("../entities/S_ACCOUNT");
const generalSer = require("../middlewares/generalfuntion");


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
      { org_code: req.user.org_code },
      { role: 2 },
    ],
  };

  const listUsers = await ACCOUNT.find(condition)
                                  .sort(sort)
                                  .limit(size)
                                  .skip(page*size);
  let count = await ACCOUNT.countDocuments(condition);

  return res.status(200).json({ success: true, code: 200, user: listUsers, size: size, page: page,total:count });
};

module.exports = {
  getListUser
};
