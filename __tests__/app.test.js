const request = require('supertest')
const app = require('../app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const testData = require('../db/data/test-data')



beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET /api/topics', () => {
    it('returns a 200 status code and returns an array of objects representing topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((res) => {
            const topics = res.body.topics
            expect(Array.isArray(topics)).toBe(true)
            expect(topics).toHaveLength(3)
            topics.forEach((topic) => {
                expect(topic).toHaveProperty('slug')
                expect(topic).toHaveProperty('description')
            })
        })
    })
})

describe('* invalid endpoints', () => {
    it('returns a 404 status code when making an invalid get request', () => {
        return request(app)
        .get('/doesn"t/exist')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toEqual('Endpoint not found')
            
        })
    })
    
    it('returns a 404 status code when making an invalid put request', () => {
        return request(app)
        .get('/doesn"t/exist')
        .send({msg: 'This should message should never '})
        .then((res) => {
            expect(res.body.msg).toEqual('Endpoint not found')
            
        })
    })
})

describe('GET /api', () => {
    it('returns a 200 status code and returns an object of available end points', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((res) => {
            const endPoints = res.body.newEndPoints
            expect(res.headers['content-type']).toMatch(/application\/json/)
            expect(endPoints).toHaveProperty('GET /api')
            expect(endPoints).toHaveProperty('GET /api/topics')
            expect(endPoints).toHaveProperty('GET /api/articles')
            
        })
    })
})

describe('GET /api/articles/:article_id', () => {
    it('returns a 200 status code when valid id given and returns an object with correct properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
            const article = res.body.article[0]
            expect(Object.keys(article)).toHaveLength(9)
            
            expect(article).toHaveProperty('author', expect.any(String));
            expect(article).toHaveProperty('title', expect.any(String));
            expect(article).toHaveProperty('article_id', expect.any(Number));
            expect(article).toHaveProperty('body', expect.any(String));
            expect(article).toHaveProperty('topic', expect.any(String));
            expect(article).toHaveProperty('created_at', expect.any(String)); 
            expect(article).toHaveProperty('votes', expect.any(Number));
            expect(article).toHaveProperty('article_img_url', expect.any(String)); 
            expect(article).toHaveProperty('comment_count', expect.any(Number)); 
            
        })
    })
    it('returns a 404 status code when non-existent id is given', () => {
        return request(app)
        .get('/api/articles/9876')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('Not Found')
        })
    })
    
    it('returns a 400 status code when invalid id is given', () => {
        return request(app)
        .get('/api/articles/invalid')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request')
        })
    })
})
describe('GET /api/articles', () => {
    it('returns a 200 status code and returns an array of article objects with correct properties and sorted in descending date order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((res) => {
            const articles = res.body.articles
            expect(articles).toHaveLength(13)
            expect(articles).toBeSortedBy('created_at', { descending: true })
            articles.forEach((article) => {
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('article_id',);
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('article_img_url');
                expect(article).toHaveProperty('comment_count');   
                expect(article).not.toHaveProperty('body');
            })
        })
    })
    it('returns a 400 status code and error message when an unrecognized query parameter is provided', () => {
        return request(app)
        .get('/api/articles?wakapaka=news')  // 'wakapaka' is an invalid query parameter
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid query parameter(s)');
        });
    }); 
    
})

describe('GET /api/articles/:article_id/comments', () => {
    it('returns a 200 status code and returns an array of comments with correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((res) => {
            const comments = res.body.comments
            expect(comments).toHaveLength(11)
            comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id', expect.any(Number));
                expect(comment).toHaveProperty('votes', expect.any(Number));
                expect(comment).toHaveProperty('created_at', expect.any(String)); 
                expect(comment).toHaveProperty('author', expect.any(String));
                expect(comment).toHaveProperty('body', expect.any(String));
                expect(comment).toHaveProperty('article_id', expect.any(Number));
            })
            
            
        })
    })  
    it('returns most recent comments first', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((res) => {
            const comments = res.body.comments
            expect(comments).toBeSortedBy('created_at', {'descending': true})
        })
        
        
    })
    it('returns a 200 status code an empty array when there are no comments for an article', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then((res) => {
            const comments = res.body.comments
            expect(comments).toEqual([])
            
        })
        
        
    })
    it('returns a 404 status code when non-existent id is given', () => {
        return request(app)
        .get('/api/articles/12321/comments')
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('Not Found')
        })
    })
    it('returns a 400 status code when invalid id is given', () => {
        return request(app)
        .get('/api/articles/invalid/comments')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request')
        })
    })
})


describe('POST /api/articles/:article_id/comments', () => {
    it('returns a 201 status code and returns an array of comments with correct properties', () => {
        return request(app)
        .post("/api/articles/3/comments")
        .send({username: "rogersop", body: "I haven't actually read the article but I am commenting anyway."
        })
        .expect(201)
        .then((res) => {            
            const comment = res.body.comment
            expect(comment.body).toEqual("I haven't actually read the article but I am commenting anyway.")
            expect(comment.article_id).toEqual(3)
        })
    }) 
    it('returns a 400 status code when invalid id is given', () => {
        return request(app)
        .post('/api/articles/invalid/comments')
        .send({username: "rogersop", body: "I haven't actually read the article but I am commenting anyway."
        })
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request')
        })
    })
    it('returns a 404 status code when non-existent id is given', () => {
        return request(app)
        .post("/api/articles/1234952/comments")
        .send({username: "rogersop", body: "I haven't actually read the article but I am commenting anyway."
        })
        .expect(404)
        .then((res) => {            
            expect(res.body.msg).toBe('Not Found')
        })
    }) 
    it('returns a 400 status code when "username" is missing in send body', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({body: "I haven't actually read the article but I am commenting anyway."
        })
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request')
        })
    })
    it('returns a 400 status code when "body" is missing in send body', () => {
        return request(app)
        .post('/api/articles/invalid/comments')
        .send({username: "rogersop"
        })
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request')
        })
    })
    it('returns a correct status code when invalid username passed', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({username: "superspiderman", body: 'This message will not send ideally'
        })
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid username')
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    it('returns a 200 status code and returns an object with correctly updated article after updating vote value', () => {
        return request(app)
        .patch("/api/articles/1")
        .send({inc_votes: 3})
        .expect(200)
        .then((res) => {
            const article = res.body.article
            expect(article).toHaveProperty('article_id', 1);
            expect(article).toHaveProperty('title', 'Living in the shadow of a great man');
            expect(article).toHaveProperty('topic', 'mitch');
            expect(article).toHaveProperty('author', 'butter_bridge');
            expect(article).toHaveProperty('body', 'I find this existence challenging');
            expect(article).toHaveProperty('created_at', expect.any(String));
            expect(article).toHaveProperty('votes', 103);
            expect(article).toHaveProperty('article_img_url', 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
            
        })
    }) 
    it('returns a 200 status code and returns an object with correctly updated article with vote value 0 after decreasing votes by more votes in existence', () => {
        return request(app)
        .patch("/api/articles/1")
        .send({inc_votes: -1239})
        .expect(200)
        .then((res) => {
            const article = res.body.article
            expect(article).toHaveProperty('article_id', 1);
            expect(article).toHaveProperty('title', 'Living in the shadow of a great man');
            expect(article).toHaveProperty('topic', 'mitch');
            expect(article).toHaveProperty('author', 'butter_bridge');
            expect(article).toHaveProperty('body', 'I find this existence challenging');
            expect(article).toHaveProperty('created_at', expect.any(String));
            expect(article).toHaveProperty('votes', 0);
            expect(article).toHaveProperty('article_img_url', 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
            
        })
    }) 
    it('returns a 400 status code when invalid id is given', () => {
        return request(app)
        .patch("/api/articles/lolopopo")
        .send({inc_votes: 3})
        .expect(400)
        .then((res) => {  
            expect(res.body.msg).toBe('Bad Request')
            
        })
        
    })
    it('returns a 404 status code when non-existent id is given', () => {
        return request(app)
        .patch("/api/articles/9898988")
        .send({inc_votes: 3})
        .expect(404)
        .then((res) => {            
            expect(res.body.msg).toBe("Not Found")
            
        })
        
    }) 
    it('returns a 400 status code when missing inc_votes key', () => {
        return request(app)
        .patch("/api/articles/2")
        .send({'not_inc_votes_lol': 3})
        .expect(400)
        .then((res) => {  
            expect(res.body.msg).toBe('Bad Request')
            
        })
        
    })
    
    it('returns a 400 status code when invalid inc_votes value passed', () => {
        return request(app)
        .patch("/api/articles/2")
        .send({'inc_votes': 'bad_value'})
        .expect(400)
        .then((res) => {  
            expect(res.body.msg).toBe('Bad Request')
            
        })
        
    })

    
})

describe('DELETE /api/comments/:comment_id', () => {
    it('returns a 204 status code after successfully deleting the comment', () => {
        return request(app)
        .delete("/api/comments/2")  
        .expect(204)  
        .then((res) => {
            expect(res.body).toEqual({});  
        });
    });
    it('returns a 400 status code for an invalid comment ID', () => {
        return request(app)
        .delete("/api/comments/invalid")  
        .expect(400)  
        .then((res) => {
            expect(res.body).toEqual({ msg: "Bad Request" }); 
        });
    });
    
    it('returns a 404 status code for a comment ID that does not exist', () => {
        return request(app)
        .delete("/api/comments/999")  
        .expect(404)  
        .then((res) => {
            expect(res.body).toEqual({ msg: "Not Found" }); 
        });
    });
});

describe('GET /api/users', () => {
    it('returns a 200 status code and returns an array of objects representing users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((res) => {
            const users = res.body.users
            expect(users).toHaveLength(4)
            expect(Array.isArray(users)).toBe(true); 
            users.forEach((user) => {
                expect(user).toHaveProperty('username', expect.any(String)); 
                expect(user).toHaveProperty('name', expect.any(String));      
                expect(user).toHaveProperty('avatar_url', expect.any(String)); 
            });
            

        })
    })
})

describe('GET /api/articles?sort_by=:sort_value&order=:order_value', () => {
    it('returns a 200 status code and returns an array of article objects sorted by author in descending order', () => {
        return request(app)
        .get('/api/articles?sort_by=author&order=desc')
        .expect(200)
        .then((res) => {
            const articles = res.body.articles
            expect(articles).toBeSortedBy('author', { descending: true })

        })
    })
    it('returns a 200 status code and returns an array of article objects sorted by title in ascending order', () => {
        return request(app)
        .get('/api/articles?sort_by=title&order=asc')
        .expect(200)
        .then((res) => {
            const articles = res.body.articles
            expect(articles).toBeSortedBy('title', { descending: false })
        })
    })
    it('returns a 200 status code and returns an array of article objects sorted by topic in ascending order', () => {
        return request(app)
        .get('/api/articles?sort_by=topic&order=asc')
        .expect(200)
        .then((res) => {
            const articles = res.body.articles
            expect(articles).toBeSortedBy('topic', { descending: false })
        })
    })
    it('returns a 200 status code and returns an array of article objects sorted by votes in descending order', () => {
        return request(app)
        .get('/api/articles?sort_by=votes&order=desc')
        .expect(200)
        .then((res) => {
            const articles = res.body.articles
            expect(articles).toBeSortedBy('votes', { descending: true })
        })
    })
    it('returns a 200 status code and returns an array of article objects sorted by article id in descending order', () => {
        return request(app)
        .get('/api/articles?sort_by=article_id&order=desc')
        .expect(200)
        .then((res) => {
            const articles = res.body.articles
            expect(articles).toBeSortedBy('article_id', { descending: true })
        })
    })
    it('returns a 400 status code when an invalid sort column is given', () => {
        return request(app)
        .get('/api/articles?sort_by=invalid_column&order=desc')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid sort column');
        });
    });
    
    it('returns a 400 status code when an invalid order value is given', () => {
        return request(app)
        .get('/api/articles?sort_by=votes&order=invalid_order')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid order value');
        });
    });
    
    
})

describe('GET /api/articles?topic=:topic_value', () => {
    it('returns a 200 status code and returns an array of article objects of a particular topic (mitch)', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then((res) => {
            const articles = res.body.articles 
            expect(articles).toHaveLength(12)        
            articles.forEach((article) => {
                expect(article).toHaveProperty('topic', 'mitch')
            })
            
        })
    })
    it('returns a 200 status code and returns an array of article objects of a particular topic (cats)', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then((res) => {
            const articles = res.body.articles
            expect(articles).toHaveLength(1)        
            articles.forEach((article) => {
                expect(article).toHaveProperty('topic', 'cats')
            })
            
        })
    })
    it('returns a 200 status code and returns an array of article objects of a particular topic (paper)', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then((res) => {
            const articles = res.body.articles 
            expect(articles).toHaveLength(0)        
            articles.forEach((article) => {
                 expect(article).toHaveProperty('topic', 'paper')
             })

        })
    })
    it('returns a 400 status code and error message when an invalid topic is provided', () => {
        return request(app)
        .get('/api/articles?topic=invalidTopic')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Invalid topic value');
        });
    });
    
}) 