const { readFile } = require("fs/promises");

exports.getEndpoints = (req, res, next) => {
  return readFile("endpoints.json", "utf8")
    .then((foundEndpoints) => {
      const parsedEndpoints = JSON.parse(foundEndpoints);
      return parsedEndpoints;
    })
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
