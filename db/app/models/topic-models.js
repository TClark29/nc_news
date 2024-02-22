const db = require("../../connection");

function getAllTopics() {
  const queryStr = "SELECT * FROM topics";

  return db.query(queryStr)
  .then((response) => {
    return response.rows;
  });
}

function insertTopic(slug, desc){

  const queryStr = `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`
  const queryVals = [slug, desc]

  return db.query(queryStr, queryVals)
  .then((response)=>{
    return response.rows[0]
  })

}

module.exports = { getAllTopics, insertTopic };
