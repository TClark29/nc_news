const {selectArticleById, selectAllArticles, updateArticleVotes} = require('./../models/article-models')

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

function patchArticle(req, res, next){
   
    const id = req.params.article_id
    const votes = req.body.inc_votes 
    return updateArticleVotes(id, votes)
    .then((response)=>{
       
        const article = response
        res.status(200).send({article})
    })
    .catch((err =>{
        next(err)
    }))
}

module.exports = {getArticle, getArticles, patchArticle}