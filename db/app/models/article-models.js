const db = require("../../connection");

function selectArticleById(id) {
  const queryStr = `SELECT * FROM articles WHERE article_id = $1`;
  return db.query(queryStr, [id])
  .then((response) => {
    if (response.rowCount === 0){
        return Promise.reject({status: 404, msg: 'Not Found'})
    }
    
    return response.rows[0];
  })
 


}

module.exports = { selectArticleById };
