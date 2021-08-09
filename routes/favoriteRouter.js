const express = require("express");
const favRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorites = require("../models/favorite");

favRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user", "username")
      .populate("dishes", "-createdAt -updatedAt -__v")
      .then((fav) => {
        res.status = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(fav);
      })
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((fav) => {
        if (fav) {
          var err = [];
          for (let i = 0; i < req.body.length; i++) {
            if (fav.dishes.includes(req.body[i]._id)) {
              let msg = req.body[i]._id;
              err[i] = msg;
            } else {
              fav.dishes.push(req.body[i]._id);
            }
          }
          if (err.length > 0) {
            res.status = 403;
            res.setHeader("Content-Type", "application/json");
            res.json({ status: "already Exists", Error: err });
            return;
          }
          fav
            .save()
            .then((result) => {
              Favorites.findById(fav._id)
                .select("-createdAt -updatedAt -__v")
                .populate("user", "username")
                .populate("dishes", "-createdAt -updatedAt -__v")
                .then((fav) => {
                  res.status = 201;
                  res.setHeader("Content-Type", "application/json");
                  res.json({ status: "created", favourites: fav });
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        } else {
          Favorites.create({ user: req.user._id })
            .then((fav) => {
              fav.dishes = req.body;
              fav
                .save()
                .then((result) => {
                  Favorites.findById(fav._id)
                    .populate("user", "username")
                    .populate("dishes", "-createdAt -updatedAt -__v")
                    .then((result) => {
                      res.status = 201;
                      res.setHeader("Content-Type", "application/json");
                      res.json({ status: "created", favourites: result });
                    })
                    .catch((err) => next(err));
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorites.deleteOne({ user: req.user._id })
      .then((result) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      })
      .catch((err) => next(err));
  });

// :/dishId Routes

favRouter
  .route("/:dishId")
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user", "username")
      .populate("dishes", "-createdAt -updatedAt -__v")
      .then(
        (fav) => {
          if (!fav) {
            res.status = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ exists: false, favourites: fav });
          } else {
            let favs = fav.dishes.filter(
              (fav) => fav._id.toString() === req.params.dishId
            );

            fav.dishes = favs;

            if (favs.length === 0) {
              res.status = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ exists: false, favourites: fav });
            } else {
              res.status = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ exists: true, favourites: fav });
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((fav) => {
        if (fav) {
          if (fav.dishes.includes(req.params.dishId)) {
            res.status = 409;
            res.setHeader("Content-Type", "application/json");
            res.json({ status: "already exists", favourites: fav });
          } else {
            fav.dishes.push(req.params.dishId);
            fav
              .save()
              .then((result) => {
                console.log(result);
                Favorites.findById(fav._id)
                  .populate("user", "username")
                  .populate("dishes", "-createdAt -updatedAt -__v")
                  .then((fav) => {
                    res.status = 201;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ status: "created", favourites: fav });
                  })
                  .catch((err) => next(err));
              })
              .catch((err) => next(err));
          }
        } else {
          Favorites.create({ user: req.user._id })
            .then((fav) => {
              fav.dishes.push(req.params.dishId);
              fav
                .save()
                .then((result) => {
                  Favorites.findById(fav._id)
                    .populate("user", "username")
                    .populate("dishes", "-createdAt -updatedAt -__v")
                    .then((fav) => {
                      res.status = 201;
                      res.setHeader("Content-Type", "application/json");
                      res.json({ status: "Created", favourites: fav });
                    })
                    .catch((err) => next(err));
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then((fav) => {
        if (fav) {
          if (fav.dishes.includes(req.params.dishId) == true) {
            fav.dishes.splice(req.params.dishId, 1);
            fav
              .save()
              .then((result) => {
                Favorites.findById(fav._id)
                  .populate("user", "username")
                  .populate("dishes", "-createdAt -updatedAt -__v")
                  .then((fav) => {
                    res.status = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ status: "deleted", favourites: fav });
                  })
                  .catch((err) => next(err));
              })
              .catch((err) => next(err));
          } else {
            res.status = 404;
            res.setHeader("Content-Type", "application/json");
            res.json({ status: "Not Exist", favourites: fav });
          }
        } else {
          res.status = 404;
          res.setHeader("Content-Type", "application/json");
          res.json({ status: "Favorites Not Exist", favourites: fav });
        }
      })
      .catch((err) => next(err));
  });

module.exports = favRouter;
