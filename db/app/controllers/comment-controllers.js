const { selectArticleById } = require('../models/article-models.js')
const {selectCommentsByArticleId} = require('../models/comment-model.js')

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


module.exports={getCommentsByArticleId}