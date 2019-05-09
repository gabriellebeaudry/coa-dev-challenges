// keep json data in array 'mydata' 
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


// create map for plotting mobility data 
var map_austin = L.map('mapid').setView([30.2672, -97.7431], 13);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map_austin);

// declare variables for use in summary statistic calculations
var total_meters = 0; 
var total_miles, total_trips, total_units = 0; 
var filtered_mydata = [];


// functions to calculate summary statistics 
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



 function filterData() {
   var startDate = new Date(document.getElementById("input_startDate").value);
   var endDate = new Date(document.getElementById("input_endDate").value);
   //var transport_mode = document.getElementById.apply("") 
   document.getElementById("dataparam_dates").innerHTML = startDate + " " + endDate;
  
   for (var i = 0; i <mydata.length; i++) {
    if ((mydata[i].start_time != undefined)){  
     tripStartDate = new Date(mydata[i].start_time.substring(0,10)); //extract date from data and make a Date object 
     tripEndDate = new Date(mydata[i].end_time.substring(0,10));
     console.log(tripStartDate + tripEndDate); 
    if  (tripStartDate.getTime() >= startDate.getTime()) { //&& (tripEndDate.getTime() <= endDate.getTime())) {
      console.log(mydata[i]); 
      filtered_mydata.push(mydata[i]); 
    }
   }
  } 
 }









 // the DATA: an array of 5000, each item is a JSON object representing a row in the dataset. 
 // goal: show statistics on dockless usage for a given date range 
 // total # of trips
 // total # of miles 
 // total # unique units identified (might need to clarify this one)
 //var url = "https://data.austintexas.gov/resource/7d8e-dm7r.json"; 
 //var ss_div = document.getElementById('ss_div');  