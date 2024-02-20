const db = require("../../connection");

function getAllTopics() {
  const queryStr = "SELECT * FROM topics";

  return db.query(queryStr)
  .then((response) => {
    return response.rows;
  });
}

module.exports = { getAllTopics };
