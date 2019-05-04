const cloudsql = require('./cloudsql');

exports.weekTrend = null;

exports.startTrendAnalysis = () => {
  const analysis = async () => {
    console.log('starting trend analysis');
    exports.weekTrend = await cloudsql.query(queryString)
      .catch(reason => console.error);
    console.log('trend analysis complete');
    console.log(JSON.stringify(exports.weekTrend));
    analysis();
  }
  analysis();
  // analysis();
  // setInterval(async () => {
  //   analysis();
  // }, 1000 * 60 * 15);
}

exports.queryTrend = () => {
  return cloudsql.query(queryString);
}

const queryString = `
SELECT
  E.HTML_HEX_CODE,
  T.EMOJI_NAME,
  count(*) AS 'TOTAL',
  SUM(CASE WHEN T.TWEET_DATETIME > NOW() - INTERVAL 1440 MINUTE THEN 1 ELSE 0 END) AS 'LAST DAY',
  SUM(CASE WHEN 
    T.TWEET_DATETIME BETWEEN 
      NOW() - INTERVAL (1440 * 2) MINUTE AND 
      NOW() - INTERVAL 1440 MINUTE 
      THEN 1 ELSE 0 END
    ) AS '1 DAY AGO',
  SUM(CASE WHEN 
    T.TWEET_DATETIME BETWEEN 
      NOW() - INTERVAL (1440 * 3) MINUTE AND 
      NOW() - INTERVAL (1440 *2) MINUTE 
      THEN 1 ELSE 0 END
    ) AS '2 DAYS AGO',
  SUM(CASE WHEN 
    T.TWEET_DATETIME BETWEEN 
      NOW() - INTERVAL (1440 * 4) MINUTE AND 
      NOW() - INTERVAL (1440 * 3) MINUTE 
      THEN 1 ELSE 0 END
    ) AS '3 DAYS AGO',
  SUM(CASE WHEN 
    T.TWEET_DATETIME BETWEEN 
      NOW() - INTERVAL (1440 * 5) MINUTE AND 
      NOW() - INTERVAL (1440 * 4) MINUTE 
      THEN 1 ELSE 0 END
    ) AS '4 DAYS AGO',
  SUM(CASE WHEN 
    T.TWEET_DATETIME BETWEEN 
      NOW() - INTERVAL (1440 * 6) MINUTE AND 
      NOW() - INTERVAL (1440 * 5) MINUTE 
      THEN 1 ELSE 0 END
    ) AS '5 DAYS AGO',
  SUM(CASE WHEN 
    T.TWEET_DATETIME BETWEEN 
      NOW() - INTERVAL (1440 * 7) MINUTE AND 
      NOW() - INTERVAL (1440 * 6) MINUTE 
      THEN 1 ELSE 0 END
    ) AS '6 DAYS AGO'
FROM
  EMOJI_CLOUD.TWEETS T
  JOIN EMOJI_CLOUD.EMOJIS E ON
  T.EMOJI_NAME = E.EMOJI_NAME
WHERE
  T.TWEET_DATETIME > NOW() - INTERVAL (1440 * 7) MINUTE
GROUP BY
  E.HTML_HEX_CODE,
  T.EMOJI_NAME
ORDER BY
  COUNT(*) DESC
LIMIT 10;
`