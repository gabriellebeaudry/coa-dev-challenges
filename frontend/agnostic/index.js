// keep json data in array 'mydata' 
var mydata; 
$.ajax({
  url: "https://data.austintexas.gov/resource/7d8e-dm7r.json",
  type: "GET",
  data: {
    $limit: 5000
  }
}).done(function(data) {
  mydata = data; // save data from API call into mydata variable 
  console.log(data); 
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
var scooter_mydata = []; 
var bike_mydata = []; 
var unique_trips = new Set(); 
var unique_units = new Set(); 
var startDate = ""; 
var endDate = ""; 
var dict_summarystats = {}; 



 function filterData() {
  filtered_mydata = []; 
   startDate = new Date(document.getElementById("input_startDate").value.replace(/-/g, '\/').replace(/T.+/, '')); // replacing the - with / fixes the time zone problem 
   endDate = new Date(document.getElementById("input_endDate").value.replace(/-/g, '\/').replace(/T.+/, ''));
   //var transport_mode = document.getElementById.apply("") 
   
  
   for (let i = 0; i <mydata.length; i++) {
    if ((mydata[i].start_time != undefined)){  
     tripStartDate = new Date(mydata[i].start_time.substring(0,10).replace(/-/g, '\/').replace(/T.+/, ''));  
     tripEndDate = new Date(mydata[i].end_time.substring(0,10).replace(/-/g, '\/').replace(/T.+/, ''));
      if ((tripStartDate >= startDate) && (tripEndDate <= endDate)) { 
        filtered_mydata.push(mydata[i]); // add data that fits the criteria to a new array 'filtered_mydata' 
      } 
      updateSummaryStatistics();  
   }
  } 
 }

function updateSummaryStatistics() { 
  $('#first_date').text("Between " +startDate.toString().substring(0, 15)+ " and ");
  $('#second_date').text(endDate.toString().substring(0,15) + " there were: ... ");  
  document.getElementById("summarystats_miles").innerHTML = getTotalMiles(filtered_mydata) + " total miles travelled"; 
  document.getElementById("summarystats_trips").innerHTML = getTotalTrips(filtered_mydata) + " total trips made with dockless vehicles";
  document.getElementById("summarystats_units").innerHTML = getUniqueUnits(filtered_mydata) + " bikes and scooters utilized";

}

// SUMMARY STATS functions 
// total number of miles

// function getSummaryStats(data_passIn) { 
//   total_meters = 0; 
//   unique_trips.clear(); 
//   unique_units.clear(); 
//   dict_summarystats= {}; 






// }



function getTotalMiles(data_passIn) { 
  total_meters = 0; 
  for (let i = 0; i <data_passIn.length; i++) { 
    if ((data_passIn[i].trip_distance != undefined)){ 
      total_meters += parseInt(data_passIn[i].trip_distance); // consider adding || 0 to deal with NaN addition;  
    }
  } 
  return Math.round(total_meters/1609.344); // convert units 
}  

// total # of trips  
function getTotalTrips(data_passIn) { 
    unique_trips.clear(); 
  for (let i = 0; i <data_passIn.length; i++) { 
    if ((data_passIn[i].trip_id != undefined)){ 
      unique_trips.add(data_passIn[i].trip_id);  
    }
  }
  return unique_trips.size; 
}  


// total unique units 
function getUniqueUnits(data_passIn) { 
  unique_units.clear(); 
for (let i = 0; i <data_passIn.length; i++) { 
  if ((data_passIn[i].device_id != undefined)){ 
    unique_units.add(data_passIn[i].device_id);  
  }
}
return unique_units.size; 
} 

 
function getMode(data_passIn) { 
  scooter_mydata = []; 
  bike_mydata = [];  

  for (let i = 0; i <data_passIn.length; i++) { 

    if (data_passIn[i].vehicle_type != undefined && data_passIn[i].vehicle_type == "scooter"){ 
      scooter_mydata.push(data_passIn[i]);  
    } 
    else if (data_passIn[i].vehicle_type != undefined && data_passIn[i].vehicle_type == "bicycle") { 
      bike_mydata.push(data_passIn[i]);
    }
  }
  var toreturn = {scooter: scooter_mydata, bike: bike_mydata}; //create a dictionary of the two datasets 
  return toreturn;  
}

//getMode(mydata).scooter; returns an array of just scooter data  

var sd = {scooter: [300, 102], bike: [100, 52]} 


// TODO: organize the scooter data into a table for making a bar chart out of 




function clearFilters() { 
  // TODO: write a function to clear the filters, reset the page nicely 



}

