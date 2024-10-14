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
            console.log(res.body.topics)
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
            console.log(res.body.msg)
            expect(res.body.msg).toEqual('Endpoint not found')

        })
    })

    it('returns a 404 status code when making an invalid put request', () => {
        return request(app)
        .get('/doesn"t/exist')
        .send({msg: 'This should message should never '})
        .expect(404)
        .then((res) => {
            console.log(res.body.msg)
            expect(res.body.msg).toEqual('Endpoint not found')

        })
    })
})
