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

exports.selectArticleByID = (id) => {
    if (isNaN(Number(id))) return Promise.reject({status: 400, msg: 'Bad Request'})
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows
    })
}


