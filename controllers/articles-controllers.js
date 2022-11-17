const {
  selectArticles,
  selectArticleById,
  updateArticleVotes,
} = require("../models/articles-models");

exports.getArticles = (req, res, next) => {
  const {sort_by, order, topic} = req.query;
  selectArticles(sort_by, order, topic).then((articles) => {
    res.status(200).send({ articles });
  })
  .catch((err) => {
    next(err);
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const bodyKeys = Object.keys(req.body);
  
  if (bodyKeys.length < 1) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - insufficient keys",
    }).catch((err) => {
      return next(err);
    });
  }
  const validKeyName = "inc_votes";

  if (!bodyKeys.includes(validKeyName)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - incorrect inc_votes key",
    }).catch((err) => {
      return next(err);
    });
  }

  if (isNaN(inc_votes)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - invalid data type, inc_votes must be a number",
    }).catch((err) => {
      return next(err);
    });
  }
  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
