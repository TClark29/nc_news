const commentRouter = require("express").Router();
const {
  deleteComment,
  getComment,
  patchComment
} = require("../db/app/controllers/comment-controllers");


commentRouter.route("/:comment_id")
.get(getComment)
.delete(deleteComment)
.patch(patchComment);

module.exports = commentRouter;
