var mydata; 
$.ajax({
  url: "https://data.austintexas.gov/resource/7d8e-dm7r.json",
  type: "GET",
  data: {
    $limit: 5000
  }
}).done(function(data) {
  mydata = data; 
  console.log(data); // delete later 
});

// the DATA: an array of 5000, each item is a JSON object representing a row in the dataset. 
// goal: show statistics on dockless usage for a given date range 
// total # of trips
// total # of miles 
// total # unique units identified (might need to clarify this one)
//var url = "https://data.austintexas.gov/resource/7d8e-dm7r.json"; 
//var ss_div = document.getElementById('ss_div');  

var total_meters = 0; 
var total_miles, total_trips, total_units = 0; 
var temp_array = []; 



// total number of miles
function getTotalMiles() { 
  for (var i = 0; i <mydata.length; i++) { 
    if ((mydata[i].trip_distance != undefined)){ 
      console.log('this is one trip_dist' + parseInt(mydata[i].trip_distance)); 
      total_meters += parseInt(mydata[i].trip_distance); // consider adding || 0 to deal with NaN addition;  
    }
  }
  total_miles = total_meters/1609.344; 
  return Math.round(total_miles); 
}
getTotalMiles(); 

// get total # of trips: count how many trip_ids there are 


//date filter - do year first? because it will half the data 
//start_time: "2019-04-27T15:15:00.000"




 function filterDate() {
   var input_startDate = document.getElementById("input_startDate").value;
   var input_endDate = document.getElementById("input_endDate").value; 
   document.getElementById("dataparam_dates").innerHTML = input_startDate + " " + input_endDate;
 }

 function a { 
  for (var i = 0; i <mydata.length; i++) { 
    mydata[i]
    if ((mydata[i].trip_distance != undefined)){ 
      console.log('this is one trip_dist' + parseInt(mydata[i].trip_distance)); 
      total_meters += parseInt(mydata[i].trip_distance); // consider adding || 0 to deal with NaN addition;  
    }
  }

 }


var map = L.map('mapid').setView([35, -98], 4);
    
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution:  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd'
}).addTo(map);







