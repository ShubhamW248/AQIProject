
var cityOptions = [
    'Aizwal', 'Amaravati', 'Amritsar', 'Bengaluru', 'Bhopal', 'Brajrajnagar',
    'Chandigarh', 'Chennai', 'Coimbatore', 'Delhi', 'Ernakulam', 'Gurugram',
    'Guwahati', 'Hyderabad', 'Jaipur', 'Jorapokhar', 'Kochi', 'Kolkata',
    'Lucknow', 'Mumbai', 'Patna', 'Shillong', 'Talcher', 'Thiruvananthapuram',
    'Visakhapatnam'
  ];
  
// Dictionary to map cities to their coordinates
var cityCoordinates = {
    'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
    'Aizawl': { lat: 23.7271, lon: 92.7176 },
    'Amaravati': { lat: 16.5167, lon: 80.6167 },
    'Amritsar': { lat: 31.6340, lon: 74.8737 },
    'Bengaluru': { lat: 12.9716, lon: 77.5946 },
    'Bhopal': { lat: 23.2599, lon: 77.4126 },
    'Brajrajnagar': { lat: 21.8251, lon: 83.9228 },
    'Chandigarh': { lat: 30.7333, lon: 76.7794 },
    'Chennai': { lat: 13.0827, lon: 80.2707 },
    'Coimbatore': { lat: 11.0168, lon: 76.9558 },
    'Delhi': { lat: 28.6139, lon: 77.2090 },
    'Ernakulam': { lat: 9.9312, lon: 76.2673 },
    'Gurugram': { lat: 28.4595, lon: 77.0266 },
    'Guwahati': { lat: 26.1445, lon: 91.7362 },
    'Hyderabad': { lat: 17.3850, lon: 78.4867 },
    'Jaipur': { lat: 26.9124, lon: 75.7873 },
    'Jorapokhar': { lat: 23.7333, lon: 86.3167 },
    'Kochi': { lat: 9.9312, lon: 76.2673 },
    'Kolkata': { lat: 22.5726, lon: 88.3639 },
    'Lucknow': { lat: 26.8467, lon: 80.9462 },
    'Mumbai': { lat: 19.0760, lon: 72.8777 },
    'Patna': { lat: 25.5941, lon: 85.1376 },
    'Shillong': { lat: 25.5788, lon: 91.8933 },
    'Talcher': { lat: 20.9502, lon: 85.2493 },
    'Thiruvananthapuram': { lat: 8.5241, lon: 76.9366 },
    'Visakhapatnam': { lat: 17.6868, lon: 83.2185 }
};

var currentDate = new Date();

// Get the current month as a zero-based index
var currentMonthZeroBased = currentDate.getMonth();

// Get the current month as a 1-based index
var Month = currentMonthZeroBased + 1;

function predictAQI() {
    // Get the selected city from the dropdown
    var selectedCity = document.getElementById("citySelect").value;

    // Get coordinates for the selected city
    var coordinates = cityCoordinates[selectedCity];

    // Make an API request to OpenWeatherMap for air quality data
    var apiKey = "4bf259715533bbb26d47540fe14d7b64    "; // Replace with your actual API key
    var apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Extract air quality components from the API response
            var co = data.list[0].components.co;
            var no = data.list[0].components.no;
            var no2 = data.list[0].components.no2;
            var o3 = data.list[0].components.o3;
            var so2 = data.list[0].components.so2;
            var pm25 = data.list[0].components.pm2_5;
            var pm10 = data.list[0].components.pm10;
            var nh3 = data.list[0].components.nh3;
            // var result = getAQIBucket(predictedAQI);

            // Display the result
            var inputData = [
                pm25,pm10, no, no2, nh3, co, so2, o3,Month
                
            ];
            

            
            
            var flaskApiUrl = 'https://my-aqi-predictor.onrender.com/predict';  // Replace with the actual URL where your Flask app is running
            fetch(flaskApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            })
                .then(response => response.json())
                .then(data => {
                    var finalPredictedAQI = data.predicted_aqi;
                    var result = data.result;
                
                    // Display the result
                    document.getElementById("result").innerHTML = `<strong>Predicted AQI:</strong> ${finalPredictedAQI}<br><strong>Verdict:</strong> ${result}<br><strong>Coordinates:</strong> Lat: ${coordinates.lat}, Lon: ${coordinates.lon}`;
                })
                
                .catch(error => {
                    console.error("Error fetching prediction data:", error);
                    document.getElementById("result").innerHTML = "Error fetching prediction data.";
                });
                
        })
        .catch(error => {
            console.error("Error fetching prediction data:", error);
            document.getElementById("result").innerHTML = "Error fetching prediction data.";
        });
        

}



function getAQIBucket(aqi) {
    if (aqi >= 13 && aqi <= 50) return "Good";
    else if (aqi >= 51 && aqi <= 100) return "Satisfactory";
    else if (aqi >= 101 && aqi <= 200) return "Moderate";
    else if (aqi >= 201 && aqi <= 300) return "Poor";
    else if (aqi >= 301 && aqi <= 400) return "Very Poor";
    else if (aqi >= 401 && aqi <= 2049) return "Severe";
    else return "Out of Range";
}


