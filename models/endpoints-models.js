const { readFile } = require("fs/promises");

exports.selectEndpoints = () => {
  return readFile("endpoints.json", "utf8").then((foundEndpoints) => {
    const parsedEndpoints = JSON.parse(foundEndpoints);
    return parsedEndpoints;
  });
};
