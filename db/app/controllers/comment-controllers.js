const { selectArticleById } = require('../models/article-models.js')
const {selectCommentsByArticleId, insertComment} = require('../models/comment-model.js')

function getCommentsByArticleId(req, res, next){
    const id = req.params.article_id
    return selectArticleById(id)
    .then(()=>{
        return selectCommentsByArticleId(id)
    })
     .then((response)=>{
        const comments = response
        res.status(200).send({comments})
    })
    .catch(next)
}

function postCommentByArticleId(req, res, next){
    const id = req.params.article_id
    const body = req.body.body
    const username = req.body.username
  
    
    return selectArticleById(id)
    .then(()=>{
      
        return insertComment(id, body, username)
    })
    .then((response)=>{
        const comment = response
        res.status(201).send({comment})
    })
    .catch(next)

}


module.exports={getCommentsByArticleId, postCommentByArticleId}