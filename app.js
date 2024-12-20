const express = require('express')
const app = express()
const cors = require('cors');
const {getTopics, getEndpoints, getArticleByID, getArticles, getCommentsByArticleID, postCommentsByArticleID, patchVoteByArticleID, deleteCommentByCommentId, getUsers} = require("./controllers/controllers")
const { generalErrors } = require('./errors-controllers/errors-controllers')
const articles = require('./db/data/test-data/articles')


app.use(cors())
app.use(express.json())
app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticleByID)

app.patch('/api/articles/:article_id', patchVoteByArticleID)

app.get('/api/articles/:article_id/comments', getCommentsByArticleID)

app.post('/api/articles/:article_id/comments', postCommentsByArticleID)

app.delete('/api/comments/:comment_id', deleteCommentByCommentId)

app.get('/api/users', getUsers)

app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'Endpoint not found' });
    next()
  });

app.use(generalErrors)

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Something went wrong", err });
  });

module.exports = app

