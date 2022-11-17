const { selectCommentsByArticleId, insertComment } = require("../models/comments-models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const newComment = req.body;
    const commentKeys = Object.keys(newComment);
 
    if (commentKeys.length < 2) {
        return Promise.reject({status: 400, msg: 'Bad request - insufficient keys'}).catch((err) => {
          return next (err);
        })
      }
    const validKeyNames = ['username', 'body']
    if (!commentKeys.includes(validKeyNames[0]) && !commentKeys.includes(validKeyNames[1])) {
        return Promise.reject({ status: 400, msg: 'Bad request - incorrect username and body keys'}).catch((err) => {
            return next (err);
        })
    } else if (!commentKeys.includes(validKeyNames[0])) {
          return Promise.reject({ status: 400, msg: 'Bad request - incorrect username key'}).catch((err) => {
            return next (err);
          })
      } 
      else if (!commentKeys.includes(validKeyNames[1])) {
          return Promise.reject({ status: 400, msg: 'Bad request - incorrect body key'}).catch((err) => {
            return next (err);
          })
      }  
    insertComment(newComment, article_id).then((comment) => {
      res.status(201)
      .send({comment})
    })
    .catch((err) => {
        return next(err);
    })
  };