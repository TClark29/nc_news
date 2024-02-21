
const {readEndpointsFile} = require('../utils')

const apiRouter = require('express').Router();

apiRouter.get('/', (req, res, next) => {
    readEndpointsFile().then((response) => {
      res.status(200).send(response);
    });
  });

module.exports = {apiRouter}