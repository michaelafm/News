const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticles,
  getArticleById,
  patchArticleVotes,
} = require("./controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
} = require("./controllers/comments-controllers");
const { getUsers } = require("./controllers/users-controllers");
const { getEndpoints } = require("./controllers/endpoints-controllers");
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).send({ msg: 'server up and running' });
})

app.get("/api", getEndpoints);

app.get("/api/users", getUsers);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);
//Route not found errors
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

//Custom errors
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//PSQL Thrown Errors
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid parametric endpoint" });
  } else {
    next(err);
  }
});

//Status 500 errors
app.use((err, req, res, next) => {
  console.log(err, "<< unhandled error");
  res.sendStatus(500);
});

module.exports = app;
