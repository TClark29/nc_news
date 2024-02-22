const db = require("../../connection");


function selectArticleById(id) {
  const queryStr = `SELECT articles.author, title, topic, articles.article_id, articles.created_at, articles.votes, article_img_url, COUNT (comments.article_id) AS comment_count FROM articles 
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`
  return db.query(queryStr, [id]).then((response) => {
    if (response.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return response.rows[0];
  });
}

function selectAllArticles(topic, sort_by = "created_at", order = "desc", limit = 10, page = 1) {
  const acceptedSortBy = ["created_at", 'article_id', 'author', 'topic', 'votes', 'title'];
  const acceptedOrder = ["desc", "asc"];
  const queryVals = [];

  if (!acceptedSortBy.includes(sort_by) || !acceptedOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryStr = `SELECT articles.author, title, topic, articles.article_id, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN 
    comments 
    ON articles.article_id = comments.article_id`;

  if (topic) {
    queryStr += ` WHERE articles.topic = $1`;
    queryVals.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  const offset = (page*limit - limit)
 queryStr += ` LIMIT ${'$'+ (queryVals.length+1)} OFFSET ${'$'+ (queryVals.length+2)}`
  
  queryVals.push(limit, offset)
  return db.query(queryStr, queryVals).then((response) => {
    return response.rows;
  });
}

function updateArticleVotes(id, votes) {
  const queryValues = [votes, id];
  const queryStr = `UPDATE articles SET votes = votes + $1 WHERE article_id= $2 RETURNING *`;
  return db.query(queryStr, queryValues).then((response) => {
    if (response.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return response.rows[0];
  });
}

function insertArticle(author, title, body, topic, article_img_url){

  let queryVals = [author, title, body, topic]

  let queryStr = `INSERT INTO articles (author, title, body, topic`

  if (article_img_url){
    queryStr += `, article_img_url`
    queryVals.push(article_img_url)

  }

  queryStr+= `) VALUES ($1, $2, $3, $4`

  if (article_img_url){
    queryStr += `, $5`
  }
  queryStr +=`) RETURNING *`

  return db.query(queryStr, queryVals)
    .then((response)=>{
      const id  = response.rows[0].article_id
      return selectArticleById(id)
  })
  


}

module.exports = { selectArticleById, selectAllArticles, updateArticleVotes, insertArticle };
