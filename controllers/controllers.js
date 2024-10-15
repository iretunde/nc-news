const {selectTopics, selectEndpoints} = require('../models/models')
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


