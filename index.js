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

const queryString = (top, minutes) => {
  if (top && minutes) {
    return `
      SELECT
        T.EMOJI_NAME,
        COUNT(*) AS TWEET_COUNT,
        E.EMOJI_DESC,
        E.HTML_HEX_CODE
      FROM
        EMOJI_CLOUD.EMOJIS E
        JOIN EMOJI_CLOUD.TWEETS T ON
        E.EMOJI_NAME = T.EMOJI_NAME
      WHERE
        T.TWEET_DATETIME > NOW() - INTERVAL ${minutes} MINUTE
      GROUP BY
        T.EMOJI_NAME,
        E.EMOJI_DESC,
        E.HTML_HEX_CODE
      ORDER BY
        COUNT(*) DESC
      LIMIT ${top};`;
  } else if (top) {
    return `
      SELECT
        T.EMOJI_NAME,
        COUNT(*) AS TWEET_COUNT,
        E.EMOJI_DESC,
        E.HTML_HEX_CODE
      FROM
        EMOJI_CLOUD.EMOJIS E
        JOIN EMOJI_CLOUD.TWEETS T ON
        E.EMOJI_NAME = T.EMOJI_NAME
      GROUP BY
        T.EMOJI_NAME,
        E.EMOJI_DESC,
        E.HTML_HEX_CODE
      ORDER BY
        COUNT(*) DESC
      LIMIT ${top};`;
  } else if (minutes) {
    return `
      SELECT
        T.EMOJI_NAME,
        COUNT(*) AS TWEET_COUNT,
        E.EMOJI_DESC,
        E.HTML_HEX_CODE
      FROM
        EMOJI_CLOUD.EMOJIS E
        JOIN EMOJI_CLOUD.TWEETS T ON
        E.EMOJI_NAME = T.EMOJI_NAME
      WHERE
        T.TWEET_DATETIME > NOW() - INTERVAL ${minutes} MINUTE
      GROUP BY
        T.EMOJI_NAME,
        E.EMOJI_DESC,
        E.HTML_HEX_CODE
      ORDER BY
        COUNT(*) DESC`;
  } else {
    return `
      SELECT
        T.EMOJI_NAME,
        COUNT(*) AS TWEET_COUNT,
        E.EMOJI_DESC,
        E.HTML_HEX_CODE
      FROM
        EMOJI_CLOUD.EMOJIS E
        JOIN EMOJI_CLOUD.TWEETS T ON
        E.EMOJI_NAME = T.EMOJI_NAME
      GROUP BY
        T.EMOJI_NAME,
        E.EMOJI_DESC,
        E.HTML_HEX_CODE
      ORDER BY
        COUNT(*) DESC`;
  }
}

const query = (top, minutes) => {
  return new Promise((resolve, reject) => {
    connection.query(queryString(top, minutes), (error, results, fields) => {
      if (error) reject(error)
      else {
        resolve(results);
      }
    });
  });
}

app.use(cors());
app.use(express.static('static'));

app.get('/api/emojis', async (req, res) => {
  const { top = 10, minutes } = req.query;
  const result = await query(top, minutes)
    .catch(e => {
      res.json({ e });
      console.log(e);
      return;
    });
    res.json(result);
});

app.listen(port, () => {
  console.log(`bde listening on port ${port}!`);
});