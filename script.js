$(document).ready(function(){


//getting current date m,d,y//
let currentDate = moment().format("MMM Do YYYY");

//creating the local storage//
let cityArray = JSON.parse(localStorage.getItem("weather"))
if (!cityArray) {
    cityArray = []
}

renderHistory()
//set city with click on search//
//also list city at top of previous searched, and move the rest down//

function renderHistory() {
    $("#previous-search-list").empty()
    for (i = 0; i < cityArray.length; i++) {
        $("#previous-search-list").prepend('<li class="history list-group-item" index=' + i + '>' + cityArray[i] + '</li>');
    }
    $(".history").on("click", function () {
        var index = $(this).attr("index")
        var city = cityArray[index]
        searchCity(city)
    })
}

$(".save").on("click", function (getCity) {


    event.preventDefault();

    let city = $(".user-city").val();
    console.log(city)
    searchCity(city)
})

//hide li element until search preformed//
 $("#daily-hide").hide();
function searchCity(city) {
    // let city = "";
    let APIKey = "31fa73962b45224b2df42c1fcf5470da";
    let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    let fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

    console.log(fiveDayQueryURL)
   
    //ajax call to openweathermap API//
    $.ajax({
        url: currentQueryURL,
        method: "GET"
    })
        .then(function (currentData) {
            //attach search city to ul//
            if (cityArray.indexOf(city) === -1) {
                cityArray.push(city)
                //
                localStorage.setItem("weather", JSON.stringify(cityArray))
                renderHistory()
            }
            //show li area now that search is preformed//
            $("#daily-hide").show();
            //attach weather data to current weather//

            let iconCode = currentData.weather[0].icon;
            let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
            $(".city-data").text("City: " + currentData.name)
            $(".date-data").text("Date: " + currentDate);
            $("#wicon").attr("src", iconURL);
            let tempF = (currentData.main.temp - 273.15) * 9 / 5 + 32;
            let tempDecimal = tempF.toFixed(2);
            $(".temp-data").text("Temperature: " + tempDecimal + " °F");
            $(".humidity-data").text("Humidity: " + currentData.main.humidity + "%");
            $(".wind-data").text("Wind Speed: " + currentData.wind.speed + " mph");
            let lon = (currentData.coord.lon);
            let lat = (currentData.coord.lat);
            let uvindexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
            console.log(currentData)
            //I need the coordinates to get the UV Index from openweather API
            //Another AJAX call to get the coordinates to retrieve the UV Index
            $.ajax({
                url: uvindexURL,
                method: "GET"
            })
                .then(function (uvIndex) {
                    let index = (uvIndex.value)
                    $(".uv-index-data").text("UV Index: " + index);
                    //setting color code for UV index based on danger level
                    //REMOVE CLASSES WHEN CHANGING!//
                    if (index < 2) {
                        $(".uv-index-data").removeClass("danger1UV danger2UV danger3UV danger4UV").addClass("safeUV");
                    }
                    else if (index >= 2 && index < 5) {
                        $(".uv-index-data").removeClass("safeUV danger2UV danger3UV danger4UV").addClass("danger1UV")
                    }
                    else if (index >= 5 && index < 8) {
                        $(".uv-index-data").removeClass("safeUV danger1UV danger3UV danger4UV").addClass("danger2UV")
                    }
                    else if (index >= 8 && index < 10) {
                        $(".uv-index-data").removeClass("safeUV danger1UV danger2UV danger4UV").addClass("danger3UV")
                    }
                    else {
                        $(".uv-index-data").removeClass("safeUV danger1UV danger2UV danger3UV").addClass("danger4UV")
                    }
                    console.log(uvindexURL)
                    console.log(uvIndex.value)

                })



            console.log(currentData);

        })


    console.log(currentQueryURL)
    console.log(currentDate)

    //find the specific spot in the return data for all 5 days, and append to correct div//

    $.ajax({
        url: fiveDayQueryURL,
        mothod: "GET"
    })
        .then(function (fiveDay) {

            // loop
            var arr = fiveDay.list
            $("#five-day-area").empty()
            for (i = 0; i < arr.length; i++) {

                if (arr[i].dt_txt.indexOf("12:00:00") !== -1) {
                    var date = arr[i].dt_txt.split(" ")[0]  // "01-05-2020 12:00:00"
                    var imglink = "http://openweathermap.org/img/w/" + arr[i].weather[0].icon + ".png";
                    var tempK = arr[i].main.temp
                    let tempF = (tempK - 273.15) * 9 / 5 + 32;
                    let temp = tempF.toFixed(2);
                    var humidity = arr[i].main.humidity
                    var fiveDayCard = `<div class="col-sm card text-white bg-primary mb-3" style="max-width: 18rem; min-width: 120px;">
                            <div class="card-header" id="date1">${date}</div>
                            <div id="day1" class="card-body">
                            <img src=${imglink}></img>
                            <p class="card-text">Temp: ${temp}°F</p>
                            <p class="card-text">Humidity: ${humidity}%</p>
                            </div>
                         </div>  `
                    $("#five-day-area").append(fiveDayCard)
                    console.log(fiveDayQueryURL)
                }
            }
            console.log(fiveDay)
        })
}
})
