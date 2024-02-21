const commentRouter = require("express").Router();
const {
  deleteComment,
  getComment,
} = require("../db/app/controllers/comment-controllers");

commentRouter.route("/:comment_id").get(getComment).delete(deleteComment);

module.exports = commentRouter;
