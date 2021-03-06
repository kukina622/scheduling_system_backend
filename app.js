let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerOptions = require("./swagger");
const expressJWT = require("express-jwt");

// errorhandler
let errorHandler = require("./middlewares/error/errorHandler");

// route
let registerRoute = require("./routes/registerRoute");
let loginRoute = require("./routes/loginRoute");
let userRoute = require("./routes/userRoute");
let shiftTimeRoute = require("./routes/shiftTimeRoute");

module.exports = function create_app(mongoURL, serect_key, saltRounds) {
  let app = express();
  return new Promise(async (resolve) => {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // solve DeprecationWarning
      useCreateIndex: true,
    });

    // 設定serect_key
    app.set("serect_key", serect_key);

    // 設定加密難易度
    app.set("saltRounds", saltRounds);

    // jwt驗證
    app.use(
      expressJWT({ secret: serect_key, algorithms: ["HS256"] }).unless({
        path: ["/api/login", "/api/register"],
      })
    );

    // 註冊路由
    app.use("/api", registerRoute);
    app.use("/api", loginRoute);
    app.use("/api/user", userRoute);
    app.use("/api/shifttime", shiftTimeRoute);

    //swagger open api
    const specs = swaggerJsdoc(swaggerOptions);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    // error handler
    app.use(errorHandler);

    resolve(app);
  });
};
