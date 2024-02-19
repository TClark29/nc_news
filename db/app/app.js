const express = require("express")
const fs = require("fs/promises")
const {readEndpointsFile} = require('../../utils')
const {getTopics} = require('../app/controllers/topic-controllers')



const app = express();
app.use(express.json());

app.get('/api', (req, res, next)=>{
   readEndpointsFile()
   .then((response)=>{
    res.status(200).send(response)
   })

})

app.get('/api/topics', getTopics)

app.use((error, req, res, next) => {
    res.status(500).send({ msg: "internal server error" })
    
   
})

module.exports = app