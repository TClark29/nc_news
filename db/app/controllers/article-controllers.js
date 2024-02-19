const {selectArticleById, selectAllArticles} = require('./../models/article-models')

function getArticles(req, res, next){
    return selectAllArticles()
    .then((response)=>{
        const articles = response
        res.status(200).send({articles})
    })
    .catch(next)
}


function getArticle(req, res, next){
    const id = req.params.id
    return selectArticleById(id)
    .then((response)=>{
        const article = response
        res.status(200).send({article})
        
       
    })
    .catch(next)
}

module.exports = {getArticle, getArticles}