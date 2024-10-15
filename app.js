const express = require('express')
const app = express()
const {getTopics, getEndpoints, getArticleByID} = require("./controllers/controllers")
const { generalErrors } = require('./errors-controllers/errors-controllers')


app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleByID)

app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'Endpoint not found' });
    next()
  });

app.use(generalErrors)

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Something went wrong", err });
  });

module.exports = app