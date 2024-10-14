const express = require('express')
const app = express()
const {getTopics} = require("./controllers/controllers")

app.get('/api/topics', getTopics)

app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'Endpoint not found' });
    next()
  });


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Something went wrong", err });
  });

module.exports = app