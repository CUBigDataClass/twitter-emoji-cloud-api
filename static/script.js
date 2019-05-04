const barChartEl = document.querySelector('#bar-chart')
const lineChartEl = document.querySelector('#line-chart')

let barData = [];
let words = [];
let data = [];
let label = [];
var datasets = [];

const fetchRecent = async (minutes = 1) => {
    const res = await fetch(`https://big-data-energy.appspot.com/api/emojis?top=10&minutes=${minutes}`)
        //const res = await fetch(`http://localhost:3000/api/emojis?top=10&minutes=1`)
        .catch(reason => console.log);
    const data = await res.json()
        .catch(reason => console.log);
    return data;
}
const getDataAllTime = async () => {
    const res = await fetch(`https://big-data-energy.appspot.com/api/emojis?top=10`)
        .catch(reason => console.log);
    const data = await res.json()
        .catch(reason => console.log);
    return data;
}
const fetchTrend = async () => {
    const res = await fetch(`https://big-data-energy.appspot.com/api/emojis/trend`)
        .catch(reason => console.log);
    const data = await res.json()
        .catch(reason => console.log);
    const formatted = data.map(value => ({
        label: String.fromCodePoint(parseInt(value.HTML_HEX_CODE.replace('&#', '0'))),
        data: [
            value["6 DAYS AGO"],
            value["5 DAYS AGO"],
            value["4 DAYS AGO"],
            value["3 DAYS AGO"],
            value["2 DAYS AGO"],
            value["1 DAY AGO"],
        ]
    }));
    console.log({ formatted });
    return formatted;
}

//const parseTrend = (data) => {
//    datasets = data.map(val => ({
//        label: value.HTML_HEX_CODE,
//        data: [
//            value["6 DAYS AGO"],
//            value["5 DAYS AGO"],
//            value["4 DAYS AGO"],
//            value["3 DAYS AGO"],
//            value["2 DAYS AGO"],
//            value["1 DAY AGO"]
//        ]
//    }));
//}


let barChart = new Chart(barChartEl, {
    type: 'horizontalBar',
    data: {
        labels: [],
        datasets: [{
            label: "Emoji Count",
            data: [],
            backgroundColor: ["#00876c", "#3e9669", "#65a465", "#8bb162", "#b2bd62", "#dac767", "#deae53", "#e19448", "#e17945", "#dd5c48"],
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

//var lineData = {
//  labels: ["last day","1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago", "6 days ago"],
//  datasets: [{
//      label: "",
//      data: [65, 59, 80, 81, 56, 55, 40,30,60,55,30,78],
//    }, {
//      label: "",
//      data: [10, 20, 60, 95, 64, 78, 90,40,70,40,70,89],
//    }
//
//  ]
//};
let lineChart = new Chart(lineChartEl, {
    type: 'line',
    labels: ["1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago", "6 days ago"],
    data: {
        datasets: []
    },
    options: {
        title: {
            display: true,
            text: ''
        }
    }
});

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
                    aspect: 'spiral',
                    "style": {
                        backgroundColor: 'black',
                        borderRadius: 2,
                        padding: '50em 50em',
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

const updateBarChart = (data) => {
    const labels = data.map(val => String.fromCodePoint(parseInt(val.HTML_HEX_CODE.replace('&#', '0'))));
    const values = data.map(val => val.TWEET_COUNT);
    barChart.data.datasets[0].data = values;
    barChart.data.labels = labels;
    barChart.update();
}

// setInterval(async () => {
//    const data = await fetchRecent();
//    updateBarChart(data);
//    updateCloud(data);
// }, 10000);

// setInterval(async () => {
//    const alldata = await fetchAllTime();
//    updateCloud(alldata);
// }, 30000);

const setLineChart = async () => {
   const trend = await fetchTrend();
   lineChart.data.datasets = trend;
   lineChart.update();
}
setLineChart();
setInterval(async () => {
    setLineChart();
}, 1000 * 60 * 10);
