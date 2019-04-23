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
  database: "EMOJI_CLOUD"
});


  connection.connect((err, ...args) => {
    if (err) {
      console.err(err, args);
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

app.use(cors());

app.get('/api/emojis', async (req, res) => {
  const top = req.query.top;
  try {
    const result = await queryTop(top);
    res.json(result.map((row) => ({ emoji: row.EMOJI_NAME, occurrences: row.OCC })))
  } catch (e) {
    res.send(e);
    console.error(e);
  }
});

app.get('/:year/:month/:day', (req, res) => {
  const { year, month, day } = req.params;
  console.log({ year, month, day });
  res.json([
    {
      text: "hello",
      count: 20
    },
    {
      text: "world",
      count: 10
    }
  ]);
});

app.listen(port, () => {
  console.log(`bde listening on port ${port}!`);
});