const barChartEl = document.querySelector('#bar-chart')
const lineChartEl = document.querySelector('#line-chart')

let barData = [];
let words = [];
let data = [];

const fetchRecent = async (minutes = 1) => {
    const res = await fetch(`https://big-data-energy.appspot.com/api/emojis?top=10&minutes=${minutes}`)
        //const res = await fetch(`http://localhost:3000/api/emojis?top=10&minutes=1`)
        .catch(reason => console.log);
    const data = await res.json()
        .catch(reason => console.log);
    return data;
}

const fetchAllTime = async () => {
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
        label: value.HTML_HEX_CODE,
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

let lineChart = new Chart(lineChartEl, {
    type: 'line',
    data: {
        labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
        datasets: [{
                data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
                label: "Africa",
                borderColor: "#3e95cd",
                fill: false
      }, {
                data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
                label: "Asia",
                borderColor: "#8e5ea2",
                fill: false
      }, {
                data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
                label: "Europe",
                borderColor: "#3cba9f",
                fill: false
      }, {
                data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
                label: "Latin America",
                borderColor: "#e8c3b9",
                fill: false
      }, {
                data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
                label: "North America",
                borderColor: "#c45850",
                fill: false
      }
    ]
    },
    options: {
        title: {
            display: true,
            text: 'World population per region (in millions)'
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