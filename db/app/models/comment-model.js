const db = require("../../connection");


function selectCommentsByArticleId(id, sort_by = "created_at", order = "desc", limit = 10, page = 1) {
  const acceptedSortBy = ["created_at"];
  const acceptedOrder = ["desc", "asc"];
  let queryVals = [id]

  if (!acceptedSortBy.includes(sort_by) || !acceptedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

 let queryStr = `SELECT * FROM comments WHERE article_id = $1 ORDER BY ${sort_by} ${order}`;

  const offset = (page*limit)-limit
  queryStr += ` LIMIT $${queryVals.length+1} OFFSET $${queryVals.length+2}`
  queryVals.push(limit, offset)

  return db.query(queryStr, queryVals).then((response) => {
    return response.rows;
  });
}


function insertComment(id, body, username) {
  const queryStr = `INSERT INTO comments (article_id, body, author) VALUES ($1, $2, $3) RETURNING*`;
  const queryValues = [id, body, username];

  return db.query(queryStr, queryValues).then((response) => {
    return response.rows[0];
  });
}

function selectComment(id){
    const queryStr = `SELECT * FROM comments WHERE comment_id = $1`
    const queryValues = [id]

    return db.query(queryStr, queryValues)
    .then((response) =>{
        if (response.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" });
          }
        return response.rows[0]
    })
}


function removeComment(id){
  

    const queryStr = `DELETE FROM comments WHERE comment_id = $1`
    const queryValues = [id]

    return db.query(queryStr, queryValues)
    .then((response) =>{
        return response.rows
    })
    

}

function updateCommentVotes(id, inc_votes){


  const queryStr = 'UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;'
  const queryVals = [inc_votes, id]

  return db.query(queryStr, queryVals)
  .then((response)=>{
    if (response.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return response.rows[0]
  })

}

module.exports = { selectCommentsByArticleId, insertComment, removeComment, selectComment, updateCommentVotes };
