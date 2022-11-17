const db = require("../db/connection");
const { checkArticleExists } = require("../utils/util-functions");

exports.selectCommentsByArticleId = (article_id) => {
  return checkArticleExists(article_id)
    .then(() => {
      return db.query(
        `
            SELECT article_id, comment_id, votes, created_at, users.username AS author, body 
            FROM comments 
                JOIN users ON comments.author = users.username
                WHERE article_id = $1
                ORDER BY comments.created_at DESC;`,
        [article_id]
      );
    })
    .then((res) => {
      return res.rows;
    });
};

exports.insertComment = ({ username, body }, article_id) => {
  return checkArticleExists(article_id)
    .then(() => {
       return db
      .query(
        'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;',
        [username, body, article_id]
      );
    })
      .then((result) => {
        return result.rows[0];
      });
  };