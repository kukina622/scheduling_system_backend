let create_app = require("./app");

// import environmental variables
require("dotenv-flow").config();

const mongoURL = `mongodb://${process.env.DATEBASE_USER}:${process.env.DATEBASE_PASSWORD}@${process.env.DATEBASE_HOST}:${process.env.DATEBASE_PORT}/${process.env.DATEBASE_NAME}`;
const port = process.env.PORT;
const serect_key = process.env.SECRET_KEY;
const saltRounds = Number.parseInt(process.env.SALT_ROUNDS);

create_app(mongoURL, serect_key, saltRounds)
  .then((app) => {
    app.listen(port, () => {
      console.log(`Start listening localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
