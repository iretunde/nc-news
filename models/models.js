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



