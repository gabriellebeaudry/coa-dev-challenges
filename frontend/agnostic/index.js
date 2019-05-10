
// ajax call to api for data 
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


//declaring variables in global scope 
var filtered_mydata = [];
var scooter_mydata = []; 
var bike_mydata = []; 
var dict_summarystats = {}; 
var startDate = ""; 
var endDate = ""; 
var combined_summarystats; // useful for the barchart 'Combined Total' data 


// filtering on date range 
 function filterData() {
  filtered_mydata = []; 
   startDate = new Date(document.getElementById("input_startDate").value.replace(/-/g, '\/').replace(/T.+/, '')); // replacing the - with / fixes the time zone problem 
   endDate = new Date(document.getElementById("input_endDate").value.replace(/-/g, '\/').replace(/T.+/, ''));
   //startDate = new Date("2019/05/01"); 
   //endDate = new Date("2019/05/05"); for quick testing 
   if (startDate > endDate) { 
     alert("Date range not valid"); // not the best asynchronous practice but it will work for this purpose 
   }
   for (let i = 0; i <mydata.length; i++) {
    if ((mydata[i].start_time != undefined)){  
     tripStartDate = new Date(mydata[i].start_time.substring(0,10).replace(/-/g, '\/').replace(/T.+/, ''));  
     tripEndDate = new Date(mydata[i].end_time.substring(0,10).replace(/-/g, '\/').replace(/T.+/, ''));
      if ((tripStartDate >= startDate) && (tripEndDate <= endDate)) { 
        filtered_mydata.push(mydata[i]); // add data that fits the criteria to a new array 'filtered_mydata' to use later 
      } 
   }
  } 
  updateSummaryStatistics(); //once filtering is done, call the summary stats function to show the data on the page  
  makeBarChart(); // use filtered data to make bar chart 
}

 
 
 // update the page with statistics based on the data filtered by date  
function updateSummaryStatistics() { 
  //document.getElementById('column_one').innerHTML = 'Data for Bikes and Scooters Combined: '; 
  $('#first_date').text("Between " +startDate.toString().substring(0, 15)+ " and ");
  $('#second_date').text(endDate.toString().substring(0,15) + " there were ");  
  combined_summarystats = getSummaryStats(filtered_mydata); // this variable will be a dictionary of summary statistics. Keys of the dict will be the variables: 'total miles', 'total trips', and 'unique units' 
  //document.getElementById("summarystats_miles").innerHTML = "<span style='font-size:40px'> combined_summarystats.tmiles </span>" + " total miles travelled"; 
  document.getElementById("summarystats_miles").innerHTML = combined_summarystats.tmiles + " total miles travelled"; 
  document.getElementById("summarystats_trips").innerHTML = combined_summarystats.ttrips + " total trips made with dockless vehicles";
  document.getElementById("summarystats_units").innerHTML = combined_summarystats.uunits + " bikes and scooters utilized";
  
}

function getSummaryStats(data_passIn) {
  // this function takes in filtered data, and returns a dictionary mapping derived values to their variable (such as total miles for the given filtered data)
  let total_meters = 0; 
  let unique_trips = new Set();  
  let unique_units = new Set(); 
  dict_summarystats= {};  

  for (let i = 0; i <data_passIn.length; i++) { 
    // get total miles 
    if ((data_passIn[i].trip_distance != undefined)){ 
      total_meters += parseInt(data_passIn[i].trip_distance);  
    }
    // get total unique trips 
    if ((data_passIn[i].trip_id != undefined)){ 
      unique_trips.add(data_passIn[i].trip_id);  
    }
    // get unique units 
    if ((data_passIn[i].device_id != undefined)){ 
      unique_units.add(data_passIn[i].device_id);  
    }
  } 
  dict_summarystats = {
    "tmiles": Math.round(total_meters/1609.344), // total miles  
    "ttrips": unique_trips.size, // total unique trips  
    "uunits": unique_units.size, // total unique units (bikes or scooters utilized) 
  }
  return dict_summarystats; 
} 



function filterByMode(data_passIn) { 
  // this function takes in an array and returns a dictionary mapping 'scooter' or 'bike' to it's respective filtered data 
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
  var dict_modearrays = {scooter: scooter_mydata, bike: bike_mydata}; 
  return dict_modearrays;  //return a dictionary of the two datasets 
}



function makeBarChart(){
  // this function plots the summary stats for each mode of transport in a bar chart 
  var bike_stats = getSummaryStats(filterByMode(filtered_mydata).bike);  
  var scoot_stats = getSummaryStats(filterByMode(filtered_mydata).scooter); 
  var bar_bike = { 
    x: ['Total Miles', 'Total Trips', 'Vehicles Used'],
    y: [bike_stats.tmiles, bike_stats.ttrips, bike_stats.uunits],
    name: 'Bike',
    type: 'bar', 
    marker: {color: 'rgb(115, 166, 176)'}
  }
  var bar_scoot = { 
    x: ['Total Miles', 'Total Trips', 'Vehicles Used'],
    y: [scoot_stats.tmiles, scoot_stats.ttrips, scoot_stats.uunits],
    name: 'Scooter',
    type: 'bar',
    marker: { color: 'rgb(252, 214, 175)'}
  }
  var bar_both = { 
    x: ['Total Miles', 'Total Trips', 'Vehicles Used'],
    y: [combined_summarystats.tmiles, combined_summarystats.ttrips, combined_summarystats.uunits],
    name: 'Combined Total',
    type: 'bar',
    marker: { color: 'rgb(239, 141, 159)'}
  }
  var data = [bar_bike, bar_scoot, bar_both]
  var layout = {
    barmode: 'group',
    //paper_bgcolor= '#E9E4DD', 
    //plot_bgcolor='#E9E4DD' 
  }
  Plotly.newPlot('plotly_div', data, layout,{responsive: true}); 
} 

function clearFilters() {  
  // reset the page  - not the cleanest way of doing this but easiest for the sake of this page
  location.reload();
}


// create map for plotting mobility data  (I didn't end up mapping the actual data, but I think the map kinda looks nice so I left it in anyways)
var map_austin = L.map('mapid').setView([30.2672, -97.7431], 13);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map_austin);

///////////////////////////////////////////////////////////////////////////////////////////// 

// some other things I might do if I were to keep working on this: 

// bold the numbers of the summary statistics 
// add a link to the data source / api documentation 
// change the column headings to only appear when filter is clicked 
