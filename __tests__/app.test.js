const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET: 200 sends an array of topic objects to the user, each with the properties slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toEqual(expect.any(Array));
        expect(res.body.topics.length).toBe(3);
        res.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("GET: 404 - returns 'route not found' to the user when an invalid end point is given", () => {
    return request(app)
      .get("/api/nonexistentroute")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });
});

describe("/api/articles", () => {
    test("GET: 200 - sends an array of article objects to the user, each with author, title, article_id, topic, created_at, votes, comment_count properties", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toEqual(expect.any(Array));
          expect(res.body.articles.length).toBe(12);
          res.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                comment_count: expect.any(Number),
                votes: expect.any(Number)
              })
            );
          });
        });
    });
    test("GET: 200 - sends an array of article objects where comment_count property is the total number of comments per article_id", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles[0].comment_count).toBe(2);
        });
    });
    test("GET: 200 - array of article objects is sorted by created_at date and time descending order by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((res) => {
          expect(res.body.articles).toBeSortedBy("created_at", {descending: true})
          expect(res.body.articles[0].author).toBe('icellusedkars');
        });
    });
  });
