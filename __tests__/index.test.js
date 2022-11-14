const app = require("../app");
const request = require("supertest");
const db = require('../db/connection')
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));

afterAll(() => {
    return db.end();
  });

describe("/api/topics", () => {
    test("GET: 200 sends an array of topic objects to the user, each with the properties slug and description", () => {
        return request(app).get("/api/topics").expect(200).then((res) => {
            expect(res.body.topics).toEqual( expect.any(Array))
            expect(Object.keys(res.body.topics[0])).toEqual(
                expect.arrayContaining([
                "slug",
                "description",
            ]))
        })
    })
    test("GET: 404 - returns 'route not found' to the user when an invalid end point is given", () => {
        return request(app).get("/api/nonexistentroute").expect(404).then((res) => {
            expect(res.body.msg).toBe("Route not found")
        })
    })
})