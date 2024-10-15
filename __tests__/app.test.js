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