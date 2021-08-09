const express = require("express");
const multer = require("multer");
const authenticate = require("../authenticate");
const cors = require("./cors");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("you can only upload image files!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();

const middlewaresArray = [
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
];

uploadRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("Get operation not suppored on /imageUpload");
    }
  )
  .post(middlewaresArray, upload.single("imageFile"), (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(req.file);
  })
  .put(middlewaresArray, (req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not suppored on /imageUpload");
  })
  .delete(middlewaresArray, (req, res, next) => {
    res.statusCode = 403;
    res.end("Delete operation not suppored on /imageUpload");
  });

module.exports = uploadRouter;
