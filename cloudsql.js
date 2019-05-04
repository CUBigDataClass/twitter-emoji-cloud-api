const config = require('./config.json');
const mysql = require('mysql');

const connection = mysql.createPool({
  host: "35.238.151.156",
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: "EMOJI_CLOUD",
});

const queryTopString = (top, minutes) => {
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

exports.queryRecent = (top, minutes) => {
  return query(queryTopString(top, minutes));
}

const query = exports.query = (queryString) => {
  return new Promise((resolve, reject) => {
    connection.query(queryString, (error, results, fields) => {
      if (error) reject(error)
      else {
        resolve(results);
      }
    });
  });
}