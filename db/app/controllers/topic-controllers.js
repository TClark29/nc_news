
const {getAllTopics, insertTopic} = require('../models/topic-models.js')


function getTopics(req, res, next) {
  return getAllTopics()
    .then((response) => {
      const topics = response;
      res.status(200).send({topics});
    })
    .catch(next);
};

function postTopic(req, res, next) {
  const slug = req.body.slug
  const desc = req.body.description
  
  return insertTopic(slug, desc)
  .then((response)=>{
    const topic = response
    res.status(201).send({topic})
  })
  .catch((err=>{
    next(err)

  }))

}
module.exports = { getTopics, postTopic};