const request = require('supertest')
const app = require('../app')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const testData = require('../db/data/test-data')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET /api/topics', () => {
    it('returns a 200 status code and returns an array of topics', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((res) => {
            const topics = res.body.topics
            expect(Array.isArray(topics)).toBe(true)
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

describe.only('GET /api/articles/:article_id', () => {
    it('returns a 200 status code when valid id given and returns an object with correct properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((res) => {
            const article = res.body.article[0]
            expect(Object.keys(article)).toHaveLength(8)
            
            expect(article).toHaveProperty('author', expect.any(String));
            expect(article).toHaveProperty('title', expect.any(String));
            expect(article).toHaveProperty('article_id', expect.any(Number));
            expect(article).toHaveProperty('body', expect.any(String));
            expect(article).toHaveProperty('topic', expect.any(String));
            expect(article).toHaveProperty('created_at', expect.any(String)); 
            expect(article).toHaveProperty('votes', expect.any(Number));
            expect(article).toHaveProperty('article_img_url', expect.any(String)); 

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

    it('returns a 404 status code when invalid id is given', () => {
        return request(app)
        .get('/api/articles/invalid')
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad Request')
        })
    })
})