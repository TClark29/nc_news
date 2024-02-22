const {
  selectArticleById,
  selectAllArticles,
  updateArticleVotes,
  insertArticle
} = require("./../models/article-models");

function getArticles(req, res, next) {
  const topic = req.query.topic;
   const sort_by = req.query.sort_by
   const order = req.query.order
  return selectAllArticles(topic, sort_by, order)
    .then((response) => {
      const articles = response;
      res.status(200).send({ articles });
    })
    .catch(next);
}

function getArticle(req, res, next) {
  const id = req.params.id;
 
  return selectArticleById(id)
    .then((response) => {
      const article = response;
      res.status(200).send({ article });
    })
    .catch(next);
}

function patchArticle(req, res, next) {
  const id = req.params.id;
  const votes = req.body.inc_votes;
  return updateArticleVotes(id, votes)
    .then((response) => {
      const article = response;
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function postArticle(req, res, next){

  const title = req.body.title
  const author = req.body.author
  const body = req.body.body
  const topic = req.body.topic
  const article_img_url = req.body.article_img_url


  return insertArticle(author, title, body, topic, article_img_url)
  .then((response)=>{
    const article = response
    res.status(201).send({article})
  })
  .catch(next)
}

module.exports = { getArticle, getArticles, patchArticle, postArticle };
