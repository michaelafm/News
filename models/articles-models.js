const db = require('../db/connection');

exports.selectArticles = () => {
  return db.query(`
  SELECT users.username AS author, title, articles.article_id, topic, articles.created_at, articles.votes, CAST(COUNT(comments.article_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments on articles.article_id = comments.article_id 
  LEFT JOIN users on articles.author = users.username
  GROUP BY users.username, title, articles.article_id, topic, articles.created_at, articles.votes
  ORDER BY articles.created_at DESC
  ;`).then((result) => {
    return result.rows;
  });
};