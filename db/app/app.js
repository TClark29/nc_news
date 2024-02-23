const express = require("express");
const fs = require("fs/promises");
const errorHandler = require('../app/controllers/error-controller')

const {apiRouter} = require('../../routes/api-router');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use(errorHandler)

module.exports = app;
