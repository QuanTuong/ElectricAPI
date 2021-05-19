const DEVICE = require("../entities/S_DEVICE");
const generalSer = require("../middlewares/generalfuntion");

const addNewDevice = async (req, res, next) => {
  try {
    const { device_name, imei, seri_sim } = req.body;
    if (!device_name) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "'device_name' is required!",
      });
    }

    if (!imei) {
      return res
        .status(400)
        .json({ success: false, code: 400, message: "'imei' is required!" });
    }

    if (!seri_sim) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "'seri_sim' is required!",
      });
    }

    const checkExist = await DEVICE.findOne({
      $or: [{ imei: imei }, { seri_sim: seri_sim }],
    });
    if (checkExist) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "device already exist",
        device: checkExist,
      });
    } else {
      const newDevice = await new DEVICE({ device_name, imei, seri_sim });

      newDevice.org_code = req.user.org_code;
      newDevice.modified_by = req.user.account_name;
      newDevice.created_by = req.user.account_name;

      await newDevice.save();

      return res.status(200).json({
        success: true,
        code: 201,
        message: "add device succesfully",
        device: newDevice,
      });
    }
    s;
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateDevice = async (req, res, next) => {
  const { device_name, imei, seri_sim, active } = req.body;

  if (!device_name) {
    return res.status(400).json({
      success: false,
      code: 400,
      message: "'device_name' is required!",
    });
  }

  if (!imei) {
    return res
      .status(400)
      .json({ success: false, code: 400, message: "'imei' is required!" });
  }

  if (!seri_sim) {
    return res
      .status(400)
      .json({ success: false, code: 400, message: "'seri_sim' is required!" });
  }

  const { deviceId } = req.params;
  const updateDevice = await DEVICE.findOne({ _id: deviceId });

  if (!updateDevice) {
    return res
      .status(400)
      .json({ success: false, code: 400, message: "id is incorrect!" });
  } else {
    const checkExist = await DEVICE.findOne({
      $and: [
        {
          $or: [{ imei: imei }, { seri_sim: seri_sim }],
        },
        { _id: { $ne: updateDevice._id } },
      ],
    });
    if (checkExist) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "value of data was conflict",
        device: checkExist,
      });
    } else {
      updateDevice.device_name = device_name;
      updateDevice.imei = imei;
      updateDevice.seri_sim = seri_sim;
      updateDevice.active = active;
      updateDevice.modified_by = req.user.account_name;

      await updateDevice.save();
      return res.status(200).json({
        success: true,
        code: 200,
        message: "updated",
        device: updateDevice,
      });
    }
  }
};

const deleteDevice = async (req, res, next) => {
  const { deviceId } = req.params;

  const passed = await generalSer.isAccess(req.user);
  if(!passed) {     return res.status(403).json({success:false,code:403,message:"permission denied!"});}
  else{
    const deviceFound = await DEVICE.findOne({_id:deviceId});
  if(!deviceFound){
    return res.status(400).json({success:false,code:400,message:"id is incorrect!"});
  }else {
    await DEVICE.findByIdAndDelete(deviceId);
    return res.status(200).json({success:true,code:200,message:"deleted"});
  }
  }
};

module.exports = {
  addNewDevice,
  updateDevice, 
  deleteDevice
};
