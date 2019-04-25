const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');

const port = process.env.PORT || 3000;
const config = require('./config.json');

const connection = mysql.createConnection({
  host: "35.238.151.156",
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: "EMOJI_CLOUD",
});

connection.connect((err, ...args) => {
  if (err) {
    console.error(err, args);
    throw err;
  }
});


const queryTop = (top) => {
  const topEmojisQueryString = `
    SELECT EMOJI_NAME, COUNT(EMOJI_NAME) AS OCC 
    FROM TWEETS 
    GROUP BY EMOJI_NAME
    ORDER BY OCC DESC
    LIMIT ${top};
    `;
  return new Promise((resolve, reject) => {
    connection.query(topEmojisQueryString, function (error, results, fields) {
      if (error) {
        reject(error);
      } else {
        console.log('Results: ', results);
        resolve(results);
      }
    });
  });
};

const queryDate = (date, top) => {
  const queryString = `
    SELECT EMOJI_NAME, COUNT(EMOJI_NAME) AS OCC 
    FROM TWEETS 
    WHERE TWEET_DATETIME > ${mysql.format('?', date)}
    GROUP BY EMOJI_NAME
    ORDER BY OCC DESC
    LIMIT ${top};
    `;
  return new Promise((resolve, reject) => {
    connection.query(queryString, function (error, results, fields) {
      if (error) {
        reject(error);
      } else {
        console.log('Results: ', results);
        resolve(results);
      }
    });
  });
}

app.use(cors());
app.use(express.static('static'));

app.get('/api/emojis', async (req, res) => {
  const { top = 10 } = req.query;
  const result = await queryTop(top)
    .catch(e => {
      res.json({e});
      console.log(e);
      return;
    });
  res.json(result.map((row) => ({ emoji: row.EMOJI_NAME, occurrences: row.OCC })))
});

app.get('/api/emojis/:year/:month/:day', async (req, res) => {
  const { year, month, day } = req.params;
  const { top = 10 } = req.query;
  console.log({ year, month, day });
  const date = new Date(year, month - 1, day);
  const result = await queryDate(date, top)
    .catch(e => {
      res.json({e});
      console.log(e);
      return;
    });
  res.json(result.map((row) => ({ emoji: row.EMOJI_NAME, occurrences: row.OCC })))
});

app.listen(port, () => {
  console.log(`bde listening on port ${port}!`);
});