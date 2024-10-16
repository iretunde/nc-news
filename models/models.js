const db = require("../db/connection")
const fs = require("fs/promises")
const path = require("path");



exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((topics) => {
        return topics.rows
    })
}

exports.selectEndpoints = () => {
    const filePath = path.resolve(__dirname, '../endpoints.json')
    return fs.readFile(filePath, 'utf-8')
     .then((data) => {
        return data
        
    }).catch((err) => {
        return err
    })

}

exports.selectArticles = (req, res, next) => {
    return db.query(`SELECT 
                        articles.author,
                        articles.title,
                        articles.article_id,
                        articles.topic,
                        articles.created_at,
                        articles.votes,
                        articles.article_img_url,
                        COALESCE(comment_counts.comment_count, 0) AS comment_count
                    FROM articles
                    LEFT JOIN (
                        SELECT article_id, COUNT(article_id) AS comment_count 
                        FROM comments 
                        GROUP BY article_id
                    ) AS comment_counts
                    ON articles.article_id = comment_counts.article_id
                    ORDER BY articles.created_at DESC`).then(({rows}) => {
        return rows
    })
}

exports.selectArticleByID = (id) => {
    if (isNaN(Number(id))) return Promise.reject({status: 400, msg: 'Bad Request'})
        return db.query("SELECT * FROM articles WHERE article_id = $1;", [id]).then(({rows}) => {
    if (rows.length === 0){
        return Promise.reject({status: 404, msg: 'Not Found'})
    }
    return rows
})
}

exports.selectCommentsByArticle = (id) => {
    if (isNaN(Number(id))) return Promise.reject({status: 400, msg: 'Bad Request'})
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [id]).then(({rows}) => {
        return rows
    })

}


