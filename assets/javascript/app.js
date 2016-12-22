//Make mess below:

//https://www.cryptonator.com/api
//https://www.cryptocompare.com/api/#-api-data-coinlist-
//https://coinmarketcap.com/api/

//Collect global variables here:
var tickerSymbol
var cryptocurrencyList = [];


//object constructor for each cryptocurrency (to easily reference the name and 3-letter symbol)
function coinObject(name, symbol) {
  this.name = name,
  this.symbol = symbol
}

//function to modify cryptocurrencyList array with ojbect for each cryptocurrency
function ccListMaker() {
    var coinListURL = "https://api.coinmarketcap.com/v1/ticker/";
      
    $.ajax({ url: coinListURL, method: "GET" }).done(function(response) {
        for (i=0; i<response.length; i++) {
            var name = response[i].name;
            var symbol = response[i].symbol;
            var coinOBJ = new coinObject(name, symbol);

        cryptocurrencyList.push(coinOBJ);
      }
      console.log(cryptocurrencyList)
    });
}
//demonstrating that the cryptocurrencyListMaker function performs properly:
ccListMaker();

//function to retrieve historical prices starting from 01/01/2015
function histPrices(coin) {
    var coinSymbol = coin;
    var currencyPriceHistory = [];
    var priceURL = "https://www.cryptocompare.com/api/data/histoday/?e=CCCAGG&fsym=" + coinSymbol + "&limit=1000&tsym=USD&toTs=1420092000"
    $.ajax({ url: priceURL, method: "GET" }).done(function(response) {
        for (p=0;p<response.Data.length; p++) { 
            var price = response.Data[p].close;
            currencyPriceHistory.push(price);
        }
    console.log(currencyPriceHistory);
    })
}
//demonstrating that the histPrices function works properly
histPrices("BTC")



//Quandle AJAX Call - Work in progress
//quandle key EDWEb1oyzs8FrfoFyG1u
function stockAJAX() {
    var queryURL = "https://www.quandl.com/api/v3/datasets/WIKI/" + tickerSymbol + ".json?column_index=4&start_date=2015-01-01&end_date=2016-12-14&collapse=daily&api_key=EDWEb1oyzs8FrfoFyG1u";
    $.ajax({ url: queryURL, method: "GET" }).done(function(response) {

        var stocksChartData = []

        for (var i = 0; i < response.dataset.data.length; i++) {
            stocksChartData.push(response.dataset.data[i][1])
        }
        console.log(stocksChartData)

        var stockDataObject = {
            label: "I will remove this",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: stocksChartData,
            spanGaps: false,
        }


    })
}

//End of Quandle AJAX Call

//Testing function
//tickerConverter('apple')

//Ticker Converter Function
function tickerConverter(userSearch) {
    $.ajax({
        success: function(response) {
            tickerSymbol = response.ResultSet.Result[0].symbol
                //We will have to put the function for the next AJAX request here.
                //This is to avoid any async issues.
            stockAJAX();
            //log to show it is working.	
            console.log(tickerSymbol)
            console.log(response)
        },
        type: "GET",
        url: "http://d.yimg.com/autoc.finance.yahoo.com/autoc",
        data: {
            query: userSearch,
            region: 'US',
            lang: 'en-US'
        },
        dataType: "jsonp"
    })
}


//Chart Stuff Below here


//Points to chart in the DOM
var ctx = $("#mainChart");

//Place holder data
var data = {

    datasets: [{
        label: "I will remove this",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40, 90],
        spanGaps: false,
    }]
};

//Global Chart settings
var mainChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});


//UI and DOM stuff below here:

$('#compare').on('click', function(e) {
    e.preventDefault();
    var userInput = $('#query-input').val().trim();
    tickerConverter(userInput)
})
