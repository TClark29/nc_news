const {selectArticleById} = require('./../models/article-models')


function getArticle(req, res, next){
    const id = req.params.id
    return selectArticleById(id)
    .then((response)=>{
        const article = response
        res.status(200).send({article})
        
       
    })
    .catch(next)
}

module.exports = {getArticle}