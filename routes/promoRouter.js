const promoRouter = require("express").Router();
const Promos = require("../models/promotions");
const authenticate = require("../authenticate");
const cors = require("./cors");

const middlewaresArray = [
  cors.corsWithOptions,
  authenticate.verifyUser,
  authenticate.verifyAdmin,
];

promoRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promos.find(req.query)
      .then(
        (promos) => {
          res.status = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promos);
        },
        (err) => next(err)
      )
      .catch((err) => console.log(err));
  })

  .post(middlewaresArray, (req, res, next) => {
    Promos.create(req.body)
      .then(
        (promo) => {
          res.status = 201;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => console.log(err));
  })

  .put(middlewaresArray, (req, res, next) => {
    res.end("Put operations not supported on /promotions.");
  })

  .delete(middlewaresArray, (req, res, next) => {
    Promos.deleteMany()
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

promoRouter
  .route("/:promoId")
  .options(cors.corsWithOptions, (req, res) => {
    res.statusCode(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promos.findById(req.params.promoId)
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => console.log(err));
  })

  .post(middlewaresArray, (req, res, next) => {
    res.statusCode = 403;
    res.end("Post operation not suppored on promo id: ", req.params.promoId);
  })

  .put(middlewaresArray, (req, res, next) => {
    Promos.findByIdAndUpdate(
      req.params.promoId,
      { $set: req.body },
      { new: true }
    )
      .then(
        (promo) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promo);
        },
        (err) => next(err)
      )
      .catch((err) => console.log(err));
  })

  .delete(middlewaresArray, (req, res, next) => {
    Promos.findByIdAndDelete(req.params.promoId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            message: "Requested promotion dish with given id has been deleted.",
          });
        },
        (err) => next(err)
      )
      .catch((err) => console.log(err));
  });

module.exports = promoRouter;
