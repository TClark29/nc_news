const db = require("../../connection");

function selectArticleById(id) {
  const queryStr = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(queryStr, [id]).then((response) => {
    if (response.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return response.rows[0];
  });
}

function selectAllArticles(sort_by = "created_at", order = "desc") {
  const acceptedSortBy = ["created_at"];
  const acceptedOrder = ["desc", "asc"];

  if (!acceptedSortBy.includes(sort_by) || !acceptedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const queryStr = `SELECT articles.author, title, topic, articles.article_id, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN 
    comments 
    ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr).then((response) => {
    return response.rows;
  });
}

function updateArticleVotes(id, votes){
    
    const queryValues = [votes, id]
    const queryStr = `UPDATE articles SET votes = votes + $1 WHERE article_id= $2 RETURNING *` 
    return db.query(queryStr, queryValues)
    .then((response)=>{
        if (response.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" });
          }
        return response.rows[0]
    })
 
    
}

module.exports = { selectArticleById, selectAllArticles, updateArticleVotes };
