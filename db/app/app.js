const express = require("express");
const fs = require("fs/promises");
const { readEndpointsFile } = require("../../utils");
const { getArticle, getArticles } = require("./controllers/article-controllers");
const { getTopics } = require("../app/controllers/topic-controllers");
const { getCommentsByArticleId, postCommentByArticleId} = require("../app/controllers/comment-controllers")

const app = express();
app.use(express.json());

app.get("/api", (req, res, next) => {
  readEndpointsFile().then((response) => {
    res.status(200).send(response);
  });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/articles/:id", getArticle);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.use((error, req, res, next) => {
  if (error.status && error.msg) {
    res.status(error.status).send({ msg: error.msg });
  }

  if(error.code === '23503') {
    res.status(401).send({msg: 'Unauthorised User' })
  }

  if (error.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });

  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
