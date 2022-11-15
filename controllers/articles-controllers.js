const {
    selectArticles, selectArticleById
  } = require('../models/articles-models');
  
  exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
      res.status(200).send({ articles });
    });
  };

  exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    })
  }