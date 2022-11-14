const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics-controllers');

app.use(express.json());

app.get('/api/topics', getTopics);

//Route not found errors
app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  });
  

//Status 500 errors
app.use((err, req, res, next) => {
res.sendStatus(500);
});

module.exports = app;
  