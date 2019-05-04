const express = require('express');
const app = express();
const cors = require('cors');

const cloudsql = require('./cloudsql');
const trends = require('./trends');

const port = process.env.PORT || 3000;

trends.startTrendAnalysis();

app.use(cors());
app.use(express.static('static'));

app.get('/api/emojis', async (req, res) => {
  const { top = 10, minutes } = req.query;
  const result = await cloudsql.queryRecent(top, minutes)
    .catch(error => {
      res.json({ error });
      console.error(e);
      return;
    });
  res.json(result);
});

app.get('/api/emojis/trend', async (req, res) => {
  if (trends.weekTrend == null) {
    res.json({ error: 'analysis not complete'});
  } else {
    res.json(trends.weekTrend);
  }
});

app.listen(port, () => {
  console.log(`bde listening on port ${port}!`);
});