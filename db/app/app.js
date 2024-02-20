const express = require("express")
const {getTopics} = require('../app/controllers/topic-controllers')



const app = express();
app.use(express.json());

app.get('/api/topics', getTopics)

app.use((error, req, res, next) => {
    res.status(500).send({ msg: "internal server error" })
    
   
})

module.exports = app