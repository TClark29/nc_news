const db = require("../../connection");

function selectAllUsers(){
    const queryStr = `SELECT * FROM users;`
    return db.query(queryStr)
    .then((response)=>{
        return response.rows
    })
}

module.exports = {selectAllUsers}