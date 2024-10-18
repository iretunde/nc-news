const db = require("../db/connection")
const fs = require("fs/promises")
const path = require("path");



exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((topics) => {
        const slug = topics.rows.map((obj) => {
            return obj.slug
        })
        return topics.rows
    })
}

exports.selectEndpoints = () => {
    const filePath = path.resolve(__dirname, '../endpoints.json')
    return fs.readFile(filePath, 'utf-8')
    .then((data) => {
        return data
        
    })
    
}

exports.selectArticles = (sort_by, order, topic) => {
    const new_sort_by = sort_by || 'created_at'
    const new_order = order || 'DESC'
    const new_topic = topic || 'everything'

    const validSortByColumns = ['created_at', 'votes', 'title', 'author', 'topic', 'article_id']; 
    const validOrderValues = ['asc', 'desc'];
    

    if (!validSortByColumns.includes(new_sort_by.toLowerCase())) {
        return Promise.reject({ status: 400, msg: 'Invalid sort column' });
    }
    if (!validOrderValues.includes(new_order.toLowerCase())) {
        return Promise.reject({ status: 400, msg: 'Invalid order value' });
    }

    return db.query('SELECT slug FROM topics;').then((data) => {
            const topics = data.rows.map((obj) => {
                return obj.slug
        })

        let queryStr = `SELECT 
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
                        ON articles.article_id = comment_counts.article_id`

        if (new_topic !== 'everything'){
            if (!topics.includes(new_topic.toLowerCase())) {
                return Promise.reject({ status: 400, msg: 'Invalid topic value' });
            }

            queryStr += ` WHERE articles.topic = '${new_topic}'`
        }

        queryStr += ` ORDER BY articles.${new_sort_by} ${new_order};`

        return db.query(queryStr).then(({rows}) => {
            return rows
        })
    })

}

exports.selectArticleByID = (id) => {
    if (isNaN(Number(id))) return Promise.reject({status: 400, msg: 'Bad Request'})
        return db.query(`SELECT articles.*, COUNT(comments) AS comment_count 
                        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
                        WHERE articles.article_id = $1 GROUP BY articles.article_id;`, [id]).then(({rows}) => {
    if (rows.length === 0){
        return Promise.reject({status: 404, msg: 'Not Found'})
    }
    return rows
})
}

exports.selectCommentsByArticle = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [id]).then(({rows}) => {
        return rows
    })
    
}

exports.insertCommentByArticleId = (id, username, body) => {
    return db.query(`INSERT INTO comments (article_id, author, body)
        VALUES ($1, $2, $3)
        RETURNING * ;`, [id, username, body]).then(({rows}) => {
            return rows
        })
        .catch((err) => {
            if (err.code === '23503'){
                return Promise.reject({status: 404, msg: 'Invalid username'})
            }
        })
        
    }
    
    exports.insertVoteByArticleID = (id, votes) => {
        if (isNaN(Number(votes))) return Promise.reject({status: 400, msg: 'Bad Request'})
            return db.query(`UPDATE articles
        SET votes = GREATEST(0, votes + $1)
        WHERE article_id = $2
        RETURNING *;`, [votes, id]).then(({rows}) => {
            return rows
        })
    }
    
    exports.selectCommentByCommentID = (id) => {
        if (isNaN(Number(id))) return Promise.reject({status: 400, msg: 'Bad Request'})
            return db.query("SELECT * FROM comments WHERE comment_id = $1;", [id]).then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return rows
    })
    }
    
    exports.removeCommentByCommentID = (id) => {
        return db.query(
            `DELETE FROM comments
             WHERE comment_id = $1
             RETURNING *;`,[id]
          ).then(({rows}) => {
            if (rows.length === 0){
                return Promise.reject({status: 404, msg: 'Not Found'})
            }
            return rows
          })
        
    }
    
    exports.selectUsers = () => {
        return db.query('SELECT * FROM users;').then(({rows}) => {
            return rows
        })


    }