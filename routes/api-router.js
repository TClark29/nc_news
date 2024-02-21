
const {readEndpointsFile} = require('../utils')
const articleRouter = require('./article-router')
const commentRouter = require('./comment-router')
const topicRouter = require('./topics-router')
const userRouter = require('./user-router')

const apiRouter = require('express').Router();

apiRouter.get('/', (req, res, next) => {
    readEndpointsFile().then((response) => {
      res.status(200).send(response);
    });
  });

  apiRouter.use('/articles', articleRouter)
  apiRouter.use('/comments', commentRouter)
  apiRouter.use('/topics', topicRouter)
  apiRouter.use('/users', userRouter)


module.exports = {apiRouter}