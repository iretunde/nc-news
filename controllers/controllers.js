const {selectTopics, selectEndpoints, selectArticleByID, selectArticles, selectCommentsByArticle, insertCommentByArticleId, insertVoteByArticleID, removeCommentByCommentID, selectCommentByCommentID, selectUsers} = require('../models/models')
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
    const {sort_by} = req.query
    const {order} = req.query
    const {topic} = req.query

    const validQueryParams = ['sort_by', 'order', 'topic', 'author'];  // Define valid query parameters
    const queryKeys = Object.keys(req.query);

    // Check if any invalid query parameters were provided
    const invalidParams = queryKeys.filter((key) => !validQueryParams.includes(key));
    if (invalidParams.length > 0) {
        return res.status(400).send({ msg: 'Invalid query parameter(s)' });
    }



    selectArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
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

exports.getCommentsByArticleID = (req, res, next) => {
    const {article_id} = req.params
    const promise = selectArticleByID(article_id)
    
    promise.then(() => {
        selectCommentsByArticle(article_id).then((comments) => {
            res.status(200).send({comments})
        })
        
    }).catch((err) => {
        next(err)
    })
    
}

exports.postCommentsByArticleID = (req, res, next) => {
    const {article_id} = req.params
    const promise = selectArticleByID(article_id)
    
    promise.then(() => {
        if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('body')){
            return Promise.reject({status: 400, msg: 'Bad Request'})
        }
        
        const username = req.body.username
        const body = req.body.body
        return insertCommentByArticleId(article_id, username, body).then((comment) => {
            res.status(201).send({comment: comment[0]})
            
        })
    }).catch((err) => {
        next(err)
    })
    
    
}

exports.patchVoteByArticleID = (req, res, next) => {
    const {article_id} = req.params
    const promise = selectArticleByID(article_id)
    
    
    promise.then(() => {
        if (!req.body.hasOwnProperty('inc_votes')){
            return Promise.reject({status: 400, msg: 'Bad Request'})
        }
        
        const votes = req.body.inc_votes
        return insertVoteByArticleID(article_id, votes).then((article) => {
            res.status(200).send({article: article[0]})
            
        })
    }).catch((err) => {
        next(err)
    }) 
    
}

exports.deleteCommentByCommentId = (req, res, next) => {
    
    const {comment_id} = req.params
    const promise = selectCommentByCommentID(comment_id)
    
    
    promise.then(() => {
        removeCommentByCommentID(comment_id).then((comment) => {
                res.status(204).send({})
        })

    }).catch((err) => {
        next(err)
    }) 

}

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })

}