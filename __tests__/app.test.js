const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));

afterAll(() => {
  return db.end();
});

describe("/api/users", () => {
  test("GET: 200 - sends an array of user objects to the user, each with the properties username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users).toEqual(expect.any(Array));
        expect(res.body.users.length).toBeGreaterThan(0);
        res.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("GET: 404 - returns 'route not found' to the user when an invalid end point is given", () => {
    return request(app)
      .get("/api/usrs")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Route not found");
      });
  });
});

describe("/api/topics", () => {
  test("GET: 200 - sends an array of topic objects to the user, each with the properties slug and description", () => {
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

describe("/api/articles?", () => {
  test("GET: 200 - filters articles by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual(expect.any(Array));
        expect(body.articles.length).toBe(11);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "mitch",
              created_at: expect.any(String),
              comment_count: expect.any(Number),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("GET: 200 - sort by column given as the sort_by query default order descending", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", {
          descending: true,
        });
        expect(body.articles[0].author).toBe("rogersop");
      });
  });
  test("GET: 200 - sort by column given as the sort_by query and order query", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=ASC")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author");
        expect(body.articles[0].author).toBe("butter_bridge");
      });
  });
  test("GET: 200 - returns empty array when given valid topic with no associated articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("GET: 400 - returns error when given invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=not_a_topic")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid topic query");
      });
  });
  test("GET: 400 - returns error for invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=not_a_column&order=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid sort_by query");
      });
  });
  test("GET: 400 - returns error for invalid order query", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid order query");
      });
  });
});

describe("/api/articles/:article_id - GET", () => {
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

describe("/api/articles/:article_id - PATCH", () => {
  test("PATCH: 200 - returns an object to the user, with updated incremented votes count (positive votes)", () => {
    const votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then((res) => {
        expect(res.body.updatedArticle).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: 101,
        });
      });
  });
  test("PATCH: 200 - returns object to the user, with updated decremented votes count (negative votes)", () => {
    const votes = { inc_votes: -110 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then((res) => {
        expect(res.body.updatedArticle).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: -10,
        });
      });
  });
  test("PATCH: 200 - returns object to the user, with updated votes count even if request object has too many keys", () => {
    const votes = {
      inc_votes: 1,
      extra_key: "I shouldn't be here",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then((res) => {
        expect(res.body.updatedArticle).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: 101,
        });
      });
  });
  test("PATCH: 400 - returns appropriate error for bad request - insufficient keys", () => {
    const votes = {};
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request - insufficient keys");
      });
  });
  test("PATCH: 400 - returns appropriate error for bad request - incorrect key name", () => {
    const votes = { inc_vots: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request - incorrect inc_votes key");
      });
  });
  test("PATCH: 400 - returns appropriate error for bad request - ivalid value data type", () => {
    const votes = { inc_votes: "word" };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad request - invalid data type, inc_votes must be a number"
        );
      });
  });
  test("PATCH: 404 - responds with an appropriate error message when provided with a non-existent article_id", () => {
    const votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1000")
      .send(votes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article ID not found");
      });
  });
  test("PATCH: 400 - responds with an appropriate error message when provided with an invalid article_id", () => {
    const votes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/invalid_id")
      .send(votes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid article ID");
      });
  });
});

describe("/api/articles/:article_id/comments - GET", () => {
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

describe("/api/articles/:article_id/comments - POST", () => {
  test("POST: 201 - request body accepts a new comment object with properties username and body", () => {
    const newComment = {
      username: "lurker",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          article_id: 1,
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "lurker",
          body: "This is a new comment",
        });
      });
  });
  test("POST: 200 - request body accepts a new comment object excluding unrequired keys", () => {
    const tooManyKeys = {
      username: "lurker",
      body: "This is a new comment",
      extraKey: "I shouldn't be here",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(tooManyKeys)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          article_id: 1,
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "lurker",
          body: "This is a new comment",
        });
      });
  });
  test("POST: 400 - responds with an appropriate error message when provided with a bad comment <2 keys", () => {
    const tooFewKeys = {
      username: "lurker",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(tooFewKeys)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request - insufficient keys");
      });
  });
  test("POST: 400 - responds with an appropriate error message when provided with a bad comment (incorrect username key)", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        usrname: "lurker",
        body: "This is a new comment",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request - incorrect username key");
      });
  });
  test("POST: 400 - responds with an appropriate error message when provided with a bad comment (incorrect body key)", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
        brdy: "This is a new comment",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request - incorrect body key");
      });
  });
  test("POST: 400 - responds with an appropriate error message when provided with a bad comment (incorrect body and username keys)", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        usrname: "lurker",
        brdy: "This is a new comment",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe(
          "Bad request - incorrect username and body keys"
        );
      });
  });
  test("POST: 404 - responds with an appropriate error message when provided with a non-existent article_id", () => {
    const newComment = {
      username: "lurker",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article ID not found");
      });
  });
  test("POST: 400 - sends appropriate error message when given an invalid article_id", () => {
    const newComment = {
      username: "lurker",
      body: "This is a new comment",
    };
    return request(app)
      .post("/api/articles/invalid_id/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid article ID");
      });
  });
});
