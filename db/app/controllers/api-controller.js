const {readEndpointsFile} = require('../../../utils.js')

function getEndpoints (req, res, next){
    return readEndpointsFile()
    .then((response)=>{
       const endpoints = response
        res.status(200).send(endpoints)

    })
    .catch(next)
}

module.exports={getEndpoints}