module.exports = { getTopics };
const {getAllTopics} = require('../models/topic-models.js')


function getTopics(req, res, next) {
  return getAllTopics()
    .then((response) => {
      const topics = response;
      res.status(200).send({topics});
    })
    .catch(next);
};
