//Config enviroment
require("dotenv").config();
const cors = require("cors");

const express = require("express");
const cloudinary = require("cloudinary").v2;
const passport = require("passport");
//const logger = require('morgan');

const routerUser = require("./controllers/UserController");
const routerDevice = require("./controllers/DeviceController");
const routerAccount = require("./controllers/AccountController");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const ACCOUNT = require("./entities/S_ACCOUNT");
const middleSer = require("./middlewares/generalfuntion");

const app = express();
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// @For tester
/* mongoose.connect('mongodb+srv://mongodb:mongodb@cluster0.5yggc.mongodb.net/mongodb?retryWrites=true&w=majority', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('Connected to MongoDB!'))
    .catch((error) => console.log(`Connect fail, please check and try again!Error: ${error}`)) */

// @For dev
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/ContructionDB", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) =>
    console.log(`Connect fail, please check and try again!Error: ${error}`)
  );

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Middlewares
//app.use(logger('dev'))
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  res.header("Access-Control-Expose-Headers", "*");
  req.header("Access-Control-Allow-Headers", "*");
  next();
});

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Account & Device API",
      description: " Managerment Accounts and Devices",
      contact: {
        email: "maituongwork@gmail.com",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./controllers/UserController.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/swagger-ui/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());

//app.use(passport.initialize())

//Routes
app.use("/api/user", routerUser);
app.use("/api/device",routerDevice);
app.use("/api/account",routerAccount)

//Catch 404 error and forward them to error handler
app.use((req, res, next) => {
  const err = new HttpError("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  console.log("Run error handle");
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  return res
    .status(status)
    .json({ success: false, code: status, message: error.message });
});

addAdmin = async () => {
  const found = await ACCOUNT.findOne({
    $or: [{ email: "admin@gmail.com" }, { mobile: "123456789" }],
  });
  if (found) {
    console.log("Admin exist");
  } else {
    const userAdmin = new ACCOUNT({
      account_name: "nsh2021",
      password: "nsh2021",
      fullname: "Nguyễn Song Hoàng",
      email: "admin@gmail.com",
      mobile: "123456789",
      org_code: "F0F",
      status: 0,
      role: 0,
    });
    userAdmin.password = await middleSer.hashPassword("nsh2021");
    userAdmin.created_by = await userAdmin.account_name;
    userAdmin.modified_by = await userAdmin.account_name;
    await userAdmin.save();

    const user1 = new ACCOUNT({
      account_name: "user1",
      password: "user1",
      fullname: "The first user name",
      email: "user1@gmail.com",
      mobile: "111111111",
      org_code: "F0F",
      status: 0,
      role: 1,
    });
    user1.password = await middleSer.hashPassword("user1");
    user1.created_by = await userAdmin.account_name;
    user1.modified_by = await userAdmin.account_name;
    user1.save();

    const user2 = new ACCOUNT({
      account_name: "user2",
      password: "user2",
      fullname: "The second user name",
      email: "user2@gmail.com",
      mobile: "2222222222",
      org_code: "F0F",
      status: 0,
      role: 1,
    });
    user2.password = await middleSer.hashPassword("user2");
    user2.created_by = await userAdmin.account_name;
    user2.modified_by = await userAdmin.account_name;
    user2.save();

    const user3 = new ACCOUNT({
      account_name: "user3",
      password: "user3",
      fullname: "The thirty user name",
      email: "user3@gmail.com",
      mobile: "3333333333",
      org_code: "F0F",
      status: 0,
      role: 1,
    });
    user3.password = await middleSer.hashPassword("user3");
    user3.created_by = await userAdmin.account_name;
    user3.modified_by = await userAdmin.account_name;
    user3.save();

    const account1 = new ACCOUNT({
      account_name: "account1",
      password: "account1",
      fullname: "The first account name",
      email: "account1@gmail.com",
      mobile: "3333333333",
      org_code: "F0F138",
      status: 0,
      role: 2,
    });
    account1.password = await middleSer.hashPassword("account1");
    account1.created_by = await userAdmin.account_name;
    account1.modified_by = await userAdmin.account_name;
    account1.save();

    const account2 = new ACCOUNT({
      account_name: "account2",
      password: "account2",
      fullname: "The second account name",
      email: "account2@gmail.com",
      mobile: "1122325225",
      org_code: "F0F",
      status: 0,
      role: 2,
    });
    account2.password = await middleSer.hashPassword("account2");
    account2.created_by = await userAdmin.account_name;
    account2.modified_by = await userAdmin.account_name;
    account2.save();

    const account3 = new ACCOUNT({
      account_name: "account3",
      password: "account3",
      fullname: "The thirty account name",
      email: "account3@gmail.com",
      mobile: "6389652868",
      org_code: "F0F",
      status: 0,
      role: 2,
    });
    account3.password = await middleSer.hashPassword("account3");
    account3.created_by = await userAdmin.account_name;
    account3.modified_by = await userAdmin.account_name;
    account3.save();
  }
};
 addAdmin();
//Error handler function

//Start server
app.set("port", process.env.PORT || 4000);
app.listen(app.get("port"), function () {
  console.log("Server is listening at port " + app.get("port"));
});
