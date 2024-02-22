const {selectAllUsers, selectUserByUsername} = require('../models/user-model')



function getUsers(req, res, next){
    return selectAllUsers()
    .then((response)=>{
        const users = response
        res.status(200).send({users})
    })
    .catch((err) =>
     {next(err)})
}

function getUser(req, res, next){
  
    const username = req.params.username
    return selectUserByUsername(username)
    .then((response) =>{
        const user = response
        res.status(200).send({user})
    })
    .catch(next)
}

module.exports = {getUsers, getUser}