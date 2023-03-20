require("dotenv").config();
const express = require("express");
const MongoConnection = require("./src/config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://plombo-web-application.vercel.app",
    methods: "*",
  })
);

MongoConnection();

const userRouter = require("./src/routes/userRoute");
const artikelRouter = require("./src/routes/artikelRoute");
const wisataRouter = require("./src/routes/wisataRoute");
const komentarRouter = require("./src/routes/komentarRoute");

// methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
// "https://plombo-web-application-diama.vercel.app",
// "https://plombo-web-application-git-master-diama.vercel.app",
// "https://plombo-web-application.vercel.app",
const mainRoute = process.env.MAIN_ROUTES;

app.use(mainRoute, userRouter);
app.use(mainRoute, artikelRouter);
app.use(mainRoute, wisataRouter);
app.use(mainRoute, komentarRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
