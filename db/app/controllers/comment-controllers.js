const { selectArticleById } = require("../models/article-models.js");
const {
  selectCommentsByArticleId,
  insertComment,
  removeComment,
  selectComment,
} = require("../models/comment-model.js");

function getCommentsByArticleId(req, res, next) {
  const id = req.params.article_id;
  return selectArticleById(id)
    .then(() => {
      return selectCommentsByArticleId(id);
    })
    .then((response) => {
      const comments = response;
      res.status(200).send({ comments });
    })
    .catch(next);
}

function postCommentByArticleId(req, res, next) {
  const id = req.params.article_id;
  const body = req.body.body;
  const username = req.body.username;

  return selectArticleById(id)
    .then(() => {
      return insertComment(id, body, username);
    })
    .then((response) => {
      const comment = response;
      res.status(201).send({ comment });
    })
    .catch(next);
}

function deleteComment(req, res, next){
    const id = req.params.comment_id
    const commentExists = selectComment(id)
    const removedComment = removeComment(id)
    return Promise.all([commentExists, removedComment])
    .then((response)=>{
        
        res.status(204).send(response[1])
    })
    .catch((err) =>{
        next(err)
    })

}

function getComment(req, res, next){
    const id = req.params.comment_id
    return selectComment(id)
    .then((response)=>{
        const comment = response
        res.status(200).send({comment})
    })
    .catch((err)=>{
        next(err)
    })

}


module.exports = { getCommentsByArticleId, postCommentByArticleId, deleteComment, getComment };
