const { getUsers } = require("../db/app/controllers/user-controller");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);

module.exports = userRouter;
