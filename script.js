let city = "tokyo"
let APIKey = "31fa73962b45224b2df42c1fcf5470da";
let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
let fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast&appid=" + APIKey;
let currentDate = moment().format("MMM Do YY");


//ajax call to openweathermap API//
$.ajax({
    url: currentQueryURL,
    method: "GET"
})
    .then(function(currentData){
        $(".city-data").text(currentData.name);
        $(".date-data").text(currentDate);
        let iconCode = currentData.weather[0].icon;
        let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        $("#wicon").attr("src", iconURL);
        let tempF = (currentData.main.temp - 273.15) * 9 / 5 + 32;
        let tempDecimal = tempF.toFixed(2);
        $(".temp-data").text(tempDecimal + " °F");
        $(".humidity-data").text(currentData.main.humidity + "%");
        $(".wind-data").text(currentData.wind.speed + " mph");
        let lon = (currentData.coord.lon);
        let lat = (currentData.coord.lat);
        let uvindexURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
            
            //I need the coordinates to get the UV Index from openweather API
            //Another AJAX call to get the coordinates to retrieve the UV Index
                $.ajax({
                    url: uvindexURL,
                    method: "GET"
                })
                    .then(function(uvIndex){
                        let index = (uvIndex.value)
                        $(".uv-index-data").text(index);
                        //setting color code for UV index based on danger level
                       if (index < 2) {
                           $(".uv-index-data").addClass("safeUV");
                       }
                       else if (index >= 2 && index < 5) {
                           $(".un-index-data").addC,ass("danger1UV")
                       }
                       else if (index >=5 && index < 8) {
                        $(".un-index-data").addC,ass("danger2UV")
                        }
                        else if (index >= 8 && index < 10) {
                            $(".un-index-data").addC,ass("danger3UV")
                        }
                        else{
                            $(".un-index-data").addC,ass("danger4UV")
                        }
                        console.log(uvindexURL)
                        console.log(uvIndex.value)
                        
                    })

        
        
            console.log(currentData);

    })

    
    console.log(currentQueryURL)
    console.log(currentDate)