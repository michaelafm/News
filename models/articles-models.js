const db = require("../db/connection");
const { checkArticleExists } = require("../utils/util-functions");
exports.selectArticles = () => {
  return db
    .query(
      `
  SELECT users.username AS author, title, articles.article_id, topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments on articles.article_id = comments.article_id 
  LEFT JOIN users on articles.author = users.username
  GROUP BY users.username, title, articles.article_id, topic, articles.created_at, articles.votes
  ORDER BY articles.created_at DESC
  ;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT users.username AS author, title, article_id, body, topic, created_at, votes 
    FROM articles 
      JOIN users
      ON articles.author = users.username
      WHERE article_id = $1`,
      [article_id]
    )
    .then((res) => {
      if (res.rows[0] !== undefined) {
        return res.rows[0];
      } else {
        return Promise.reject({
          status: 404,
          msg: "Article ID not found",
        });
      }
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return checkArticleExists(article_id)
    .then(() => {
      return db.query(
        `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2;`,
        [inc_votes, article_id]
      );
    })
    .then(() => {
      return db.query(
        `SELECT users.username AS author, title, article_id, body, topic, created_at, votes 
          FROM articles 
            JOIN users
            ON articles.author = users.username
            WHERE article_id = $1`,
        [article_id]
      );
    })
    .then((res) => {
      return res.rows[0];
    });
};
