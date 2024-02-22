const { getUsers, getUser } = require("../db/app/controllers/user-controller");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);

userRouter.route("/:username").get(getUser)

module.exports = userRouter;
