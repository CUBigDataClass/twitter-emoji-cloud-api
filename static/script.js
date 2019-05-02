
const tableRows = document.querySelectorAll('tbody tr');
const barChartEl = document.querySelector('#bar-chart')

let barData = [];

const getData = async (minutes = 1) => {
  const res = await fetch(`https://big-data-energy.appspot.com/api/emojis?top=10&minutes=${minutes}`)
    //const res = await fetch(`http://localhost:3000/api/emojis?top=10&minutes=1`)
    .catch(reason => console.log);
  const data = await res.json()
    .catch(reason => console.log);
  return data;
}

const getDataAllTime = async () => {
  const res = await fetch(`https://big-data-energy.appspot.com/api/emojis?top=10`)
    //const res = await fetch(`http://localhost:3000/api/emojis?top=10&minutes=1`)
    .catch(reason => console.log);
  const data = await res.json()
    .catch(reason => console.log);
  return data;
}

const updateTable = (tableRows, data) => {
  for (let i = 0; i < 10; i++) {
    const { EMOJI_NAME, TWEET_COUNT, HTML_HEX_CODE } = data[i];
    const children = tableRows[i].children;
    children[0].innerText = EMOJI_NAME;
    children[1].innerText = String.fromCodePoint(parseInt(HTML_HEX_CODE.replace('&#', '0')));
    children[2].innerText = TWEET_COUNT.toLocaleString();
  }
}


/* Word cloud function */
const updateCloud = (data) => {
  const words = data.map((val) => {
    return {
      text: String.fromCodePoint(parseInt(val.HTML_HEX_CODE.replace('&#', '0'))),
      count: val.TWEET_COUNT
    };
  });
  var myConfig = {
    "graphset": [
      {
        "type": "wordcloud",
        "options": {
          "style": {
            "tooltip": {
              content: '<img src="../img/color.jpg" alt="">',
              visible: true,
              text: '%text: %hits'
            },
            fontFamily: 'Roboto'
          },
          words
        }
      }
    ]
  };
  zingchart.render({
    id: 'myChart',
    data: myConfig,
    height: '100%',
    width: '100%'
  });
}

let barChart = new Chart(barChartEl, {
  type: 'horizontalBar',
  data: {
    labels: [],
    datasets: [{
      label: "Emoji Count",
      data: []
    }]
  },
  options: {}
});

const updateBarChart = (data) => {
  const labels = data.map(val => String.fromCodePoint(parseInt(val.HTML_HEX_CODE.replace('&#', '0'))));
  const values = data.map(val => val.TWEET_COUNT);
  barChart.data.datasets[0].data = values;
  barChart.data.labels = labels;
  barChart.update();
}

// main
setInterval(async () => {
  const data = await getData();
  updateTable(tableRows, data);
  updateCloud(data);
  updateBarChart(data);
}, 1000);
