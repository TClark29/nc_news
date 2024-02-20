const {selectAllUsers} = require('../models/user-model')



function getUsers(req, res, next){
    return selectAllUsers()
    .then((response)=>{
        const users = response
        res.status(200).send({users})
    })
    .catch((err) =>
     {next(err)})
}

module.exports = {getUsers}