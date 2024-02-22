const db = require("../../connection");

function selectAllUsers(){
    const queryStr = `SELECT * FROM users;`
    return db.query(queryStr)
    .then((response)=>{
        return response.rows
    })
}

function selectUserByUsername(username){
    const queryStr = 'SELECT * FROM users WHERE username=$1'
    const queryVals = [username]
    return db.query(queryStr, queryVals)
    
    .then((response)=>{
        if (response.rowCount === 0){
            return Promise.reject({status:404, msg: 'Not Found'})
        }
        return response.rows[0]
    })
}

module.exports = {selectAllUsers, selectUserByUsername}