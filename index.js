require("dotenv").config();
const express = require("express");
const MongoConnection = require("./src/config/db");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 4000;
const mainRoute = process.env.MAIN_ROUTES;
MongoConnection();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://plombo-web-application.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
  })
);

app.use(express.urlencoded({ extended: false }));

const userRouter = require("./src/routes/userRoute");
const artikelRouter = require("./src/routes/artikelRoute");
const wisataRouter = require("./src/routes/wisataRoute");
const komentarRouter = require("./src/routes/komentarRoute");

// "https://plombo-web-application-diama.vercel.app",
// methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
// "https://plombo-web-application-git-master-diama.vercel.app",
// "https://plombo-web-application.vercel.app",

app.use(mainRoute, userRouter);
app.use(mainRoute, artikelRouter);
app.use(mainRoute, wisataRouter);
app.use(mainRoute, komentarRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
