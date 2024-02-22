const { getTopics, postTopic } = require("../db/app/controllers/topic-controllers");

const topicRouter = require("express").Router();

topicRouter.route("/").get(getTopics).post(postTopic);

module.exports = topicRouter;
