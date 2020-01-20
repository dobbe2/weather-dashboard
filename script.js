//getting current date m,d,y//
let currentDate = moment().format("MMM Do YYYY");
let cityArray = [];
//set city with click on search//
//also list city at top of previous searched, and move the rest down//
$(".save").on("click", function(getCity){
    
    
    event.preventDefault();

    let city = $(".user-city").val();
    console.log(city)
   
    
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
    .then(function(currentData){
        //attach search city to ul//
        //*TUTOR* help linking the current data with the city//
         $("#previous-search-list ul").prepend('<li><a href="currentQueryURL">' + city + '</li>');


        //attach weather data to current weather//
        $(".city-data").text("City: " + currentData.name);
        $(".date-data").text("Date: " + currentDate);
        let iconCode = currentData.weather[0].icon;
        let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
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
                    .then(function(uvIndex){
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
                       else if (index >=5 && index < 8) {
                        $(".uv-index-data").removeClass("safeUV danger1UV danger3UV danger4UV").addClass("danger2UV")
                        }
                        else if (index >= 8 && index < 10) {
                            $(".uv-index-data").removeClass("safeUV danger1UV danger2UV danger4UV").addClass("danger3UV")
                        }
                        else{
                            $(".uv-index-data").removeClass("safeUV danger1UV danger2UV danger3UV").addClass("danger4UV")
                        }
                        console.log(uvindexURL)
                        console.log(uvIndex.value)
                        
                    })

        
        
            console.log(currentData);

    })

    
    console.log(currentQueryURL)
    console.log(currentDate)

    $.ajax({
        url: fiveDayQueryURL,
        mothod: "GET"
    })
    .then(function(fiveDay){
        $(".date1").text(fiveDay.date)
        console.log(fiveDay)
    })
})

