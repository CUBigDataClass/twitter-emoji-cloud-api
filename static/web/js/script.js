/* Variable declarations */
var slider = document.getElementById("myRange");
var output = document.getElementById("sValue");
output.innerHTML = slider.value;
/* AJAX Request Initialize */
var ourRequest = new XMLHttpRequest();
/* words array of objects */
var words = [
    {
    "text": "&#128550;",
    "count": 300
    }
];
/* Word cloud function */
function wCloud() {
    var myConfig = {
        "graphset": [ 
        {
            "type": "wordcloud",  
            "options": {
            "style": {
                "tooltip": { 
                content:'<img src="../img/color.jpg" alt="">',
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
/* AJAX request function */
function request(value) {
//    ourRequest.open('GET','js/test-' + value + '.json');
    ourRequest.open('GET','https://twitter-image-cloud-api.herokuapp.com/12/12/12');
    ourRequest.onload = function() {
        if (ourRequest.status >= 200 && ourRequest.status < 400){
            words = JSON.parse(ourRequest.responseText);
            wCloud();
        }else {
            console.log("We connected to the server, but it returned an error.");
        }
    };
    ourRequest.onerror = function() {
        console.log("Connection error");
    };
    ourRequest.send();  
}
/* Initial AJAX request */
request(0);
/* Todays date */
var today = new Date();
today.setDate(today.getDate());
var options = { month: 'numeric', day: 'numeric', year: 'numeric' };
date.innerHTML = today.toLocaleString('en-US', options);
/* Change values based on slider */
slider.oninput = function () {
    /* (this.value) day(s) ago */
    output.innerHTML = this.value;
    /* change date based on how a=many days ago */
    var otherDay = new Date();
    otherDay.setDate(today.getDate() - this.value);
    date.innerHTML = (otherDay.toLocaleString('en-US', options));
    /* AJAX request based on day */
    request(this.value);
//    console.log('js/test-' + this.value + '.json');
//    console.log(words);
};