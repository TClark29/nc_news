const {
  getArticle,
  getArticles,
  patchArticle,
  postArticle,
  deleteArticle
} = require("../db/app/controllers/article-controllers");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../db/app/controllers/comment-controllers");


const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle);

articleRouter.route("/:id").get(getArticle).patch(patchArticle).delete(deleteArticle);

articleRouter.route("/:article_id/comments").get(getCommentsByArticleId).post(postCommentByArticleId)

module.exports = articleRouter
