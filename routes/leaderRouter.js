const leaderRouter = require("express").Router();
const Leaders = require("../models/leaders");
const authenticate = require("../authenticate");
const cors = require("./cors");

const middlewaresArray = [
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
];

leaderRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Leaders.find(req.query)
      .then(
        (leaders) => {
          res.status = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
        },
        (err) => next(err)
      )
      .catch((err) => console.log(err));
  })

  .post(middlewaresArray, (req, res, next) => {
    Leaders.create(req.body)
      .then(
        (leader) => {
          res.status = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => console.log(err));
  })

  .put(middlewaresArray, (req, res, next) => {
    res.end("Put operations not supported on /leaders.");
  })

  .delete(middlewaresArray, (req, res, next) => {
    Leaders.deleteMany()
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => console.log(err));
  });

leaderRouter
  .route("/:leaderId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(middlewaresArray, (req, res, next) => {
    res.statusCode = 403;
    res.end("Post operation not suppored on leader id: " + req.params.leaderId);
  })

  .put(middlewaresArray, (req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete(middlewaresArray, (req, res, next) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            message: "Requested dish with given id has been deleted.",
          });
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = leaderRouter;
