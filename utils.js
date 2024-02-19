const { read } = require("fs")
const fs = require("fs/promises")

function readEndpointsFile(){
    return fs.readFile('endpoints.json', "utf8")
   .then((response)=>{
    const endpoints = JSON.parse(response)
    return {endpoints}
   })

}


module.exports = {readEndpointsFile}

