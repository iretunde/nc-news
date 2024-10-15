const {selectTopics, selectEndpoints, selectArticleByID, selectArticles} = require('../models/models')
const fs = require("fs/promises")



exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    }).catch((err) => {
        next()
    })

}

exports.getEndpoints = (req, res, next) => {
    selectEndpoints().then((endPoints) => {
        const newEndPoints = JSON.parse(endPoints)
        res.status(200).send({newEndPoints})
    })


}

exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
}


exports.getArticleByID = (req, res, next) => {
    const {article_id} = req.params
    selectArticleByID(article_id).then((article) => {
        res.status(200).send({article})

    }).catch((err) => {
        next(err)
    })

}

