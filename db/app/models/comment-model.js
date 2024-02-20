const db = require("../../connection")


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

function insertComment(id, body, username){
    

    const queryStr = `INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING*`
    const queryValues = [id, body, username]

    return db.query(queryStr, queryValues)
    .then((response)=>{
        return response.rows[0]
    })
   
   




}





module.exports = {selectCommentsByArticleId, insertComment}