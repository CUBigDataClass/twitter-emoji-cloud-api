const barChartEl = document.querySelector('#bar-chart')
const lineChartEl = document.querySelector('#line-chart')

let barData = [];
let words = [];
let data = [];
let label = [];
var datasets = [];
var pallete = ["#00876c", "#3e9669", "#65a465", "#8bb162", "#b2bd62", "#dac767", "#deae53", "#e19448", "#e17945", "#dd5c48"];


const fetchRecent = async (minutes = 1) => {
    const res = await fetch(`https://big-data-energy.appspot.com/api/emojis?top=10&minutes=${minutes}`)
        .catch(console.log);
    const data = await res.json()
        .catch(console.log);
    return data;
}
const fetchAllTime = async () => {
    const res = await fetch(`https://big-data-energy.appspot.com/api/emojis?top=30`)
        .catch(console.log);
    const data = await res.json()
        .catch(console.log);
    return data;
}
const fetchTrend = async () => {
    const res = await fetch(`https://big-data-energy.appspot.com/api/emojis/trend`)
        .catch(console.log);
    const data = await res.json()
        .catch(console.log);
    const formatted = data.map((value, i) => ({
        label: String.fromCodePoint(parseInt(value.HTML_HEX_CODE.replace('&#', '0'))),
        backgroundColor: pallete[i],
        data: [
            value["6 DAYS AGO"],
            value["5 DAYS AGO"],
            value["4 DAYS AGO"],
            value["3 DAYS AGO"],
            value["2 DAYS AGO"],
            value["1 DAY AGO"],
        ]
    }));
    return formatted;
}

let barChart = new Chart(barChartEl, {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: "Emoji Count",
            data: [],
            backgroundColor: pallete,
            borderWidth: 3
    }]
    },
    options: {
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        title: {
            display: false,
            text: 'Top 10 emojis in the past minute'
        },
        backgroundColor: 'rgba(0, 0, 0, 1)',
        scales: {
            yAxes: [{
                gridLines: {
                    display: false
                }
            }]
        }
    }
});

let lineChart = new Chart(lineChartEl, {
    type: 'bar',
    data: {
        labels: ["6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "1 day ago"],
        datasets: []
    },
    options: {
        title: {
            display: true,
            text: ''
        }
    }
});

const updateCloud = async () => {
    const data = await fetchAllTime();
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
                    maxFontSize: 100,
                    minFontSize: 30,
                    aspect: 'spiral',
                    "style": {
                        backgroundColor: 'black',
                        borderRadius: 10,
                        margin: '60em 60em',
                        hoverState: {
                            alpha: 1,
                            backgroundColor: 'white',
                            borderColor: 0,
                            fontColor: 'black',
                            textAlpha: 1,
                        },
                        tooltip: {
                            text: '%text: %hits',
                            visible: true,
                            alpha: 0.9,
                            backgroundColor: 'black',
                            borderColor: 'none',
                            borderRadius: 2,
                            fontColor: 'white',
                            textAlpha: 1,
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


updateCloud();

const updateBarChart = (data) => {
    const labels = data.map(val => String.fromCodePoint(parseInt(val.HTML_HEX_CODE.replace('&#', '0'))));
    const values = data.map(val => val.TWEET_COUNT);
    barChart.data.datasets[0].data = values;
    barChart.data.labels = labels;
    barChart.update();
}

 setInterval(async () => {
    const data = await fetchRecent();
    updateBarChart(data);
 }, 1000);

const setLineChart = async () => {
    const trend = await fetchTrend();
    lineChart.data.datasets = trend;
    lineChart.update();
}

setLineChart();
setInterval(async () => {
    setLineChart();
}, 1000 * 60 * 10);
