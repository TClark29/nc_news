const db = require("../../connection")
selectCommentsByArticleId

function selectCommentsByArticleId(id, sort_by='created_at', order='desc'){

    const acceptedSortBy = ['created_at']
    const acceptedOrder = ['desc', 'asc']

    if (!acceptedSortBy.includes(sort_by) || !acceptedOrder.includes(order)){
        return Promise.reject({status:400, msg: 'Bad Request'})
    }

    const queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sort_by} ${order}`
    return db.query(queryStr, [id])
    .then((response)=>{
        return response.rows
    })
}





module.exports = {selectCommentsByArticleId}