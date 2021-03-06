const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const dotenv  =  require("dotenv");

dotenv.config();

const mongoose = require("mongoose");

const passport = require("passport");
const authenticate = require("./authenticate");


const indexRouter = require("./routes/index");
const router = require("./routes/users");
const dishRouter = require("./routes/dishRouter");
const promoRouter = require("./routes/promoRouter");
const leaderRouter = require("./routes/leaderRouter");
const uploadRouter = require("./routes/uploadRouter");
const favRouter = require("./routes/favoriteRouter");
const commentRouter = require("./routes/commentRouter");

const url = process.env.mongoUrl || '';
const connect = mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
connect
  .then((db) => {
    console.log("Connected Successfully");
  })
  .catch((err) => console.log(err));

const app = express();

app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/users", router);
app.use(express.static(path.join(__dirname, "public")));

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorites", favRouter);
app.use("/comments", commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
