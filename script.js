$(document).ready(function() {
    // Function to get current location and update ThingSpeak
    function updateLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latitude = position.coords.latitude.toFixed(6);
                var longitude = position.coords.longitude.toFixed(6);

                $('#latitude').text(latitude);
                $('#longitude').text(longitude);

                sendDataToThingSpeak(latitude, longitude);
            }, function(error) {
                alert('Error occurred: ' + error.message);
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }

    // Click event handler for updating location
    $('#logButton').click(function() {
        updateLocation();
    });

    // Fetch ThingSpeak data and display chart
    fetchThingSpeakData();
});

// Function to send data to ThingSpeak
function sendDataToThingSpeak(latitude, longitude) {
    var apiUrl = "https://api.thingspeak.com/update?api_key=RQJZEV2ZM3HKGMA0&field1=" + latitude + "&field2=" + longitude;

    $.ajax({
        url: apiUrl,
        type: 'GET',
        success: function() {
            console.log('Data sent to ThingSpeak successfully.');

            // Fetch ThingSpeak data again to update the chart
            fetchThingSpeakData();
        },
        error: function(error) {
            console.log('Error sending data to ThingSpeak: ' + error);
        }
    });
}

// Function to fetch ThingSpeak data and display chart
function fetchThingSpeakData() {
    var apiUrl = "https://api.thingspeak.com/channels/2517667/feeds.json?api_key=HZJKD6YYELWDFVQG&results=1";

    $.getJSON(apiUrl, function(data) {
        var feeds = data.feeds;
        if (feeds.length > 0) {
            var latestData = feeds[0];
            $('#tsLatitude').text(latestData.field1);
            $('#tsLongitude').text(latestData.field2);

            // Display ThingSpeak chart
            displayThingSpeakChart();
        } else {
            console.log('No data available from ThingSpeak.');
        }
    });
}

// Function to display ThingSpeak chart
function displayThingSpeakChart() {
    var iframe = '<iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2517667/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>';
    $('#thingSpeakChart').html(iframe);
}
