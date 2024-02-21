const { getTopics } = require("../db/app/controllers/topic-controllers");

const topicRouter = require("express").Router();

topicRouter.route("/").get(getTopics);

module.exports = topicRouter;
