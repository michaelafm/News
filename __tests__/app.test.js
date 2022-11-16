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
              votes: expect.any(Number),
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
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(res.body.articles[0].author).toBe("icellusedkars");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 - returns an object to the user, with author (username from the users table), title, article_id, body, topic, created_at, and votes properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: 100,
        });
      });
  });
  test("GET: 404 - sends appropriate error message when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article ID not found");
      });
  });
  test("GET: 400 - sends appropriate error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid article ID");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 - returns an array of comment objects for the given article_id, each with properties: comment_id, votes, created_at, author(as the username from users table), and body", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toEqual(expect.any(Array));
        expect(res.body.comments.length).toBeGreaterThan(0);
        res.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: 1,
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("GET: 200 - array of comment objects is ordered by created_at date and time descending by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(res.body.comments[0]).toEqual({
          article_id: 1,
          comment_id: 5,
          votes: 0,
          created_at: "2020-11-03T21:00:00.000Z",
          author: "icellusedkars",
          body: "I hate streaming noses",
        });
      });
  });
  test("GET: 200 - returns empty array when given existing article_id with no associated comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("GET: 404 - sends appropriate error message when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID not found");
      });
  });
  test("GET: 400 - sends appropriate error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid article ID");
      });
  });
});
