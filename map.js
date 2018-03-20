
var weeklyUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(weeklyUrl, function(data) {
    
    pullData(data.features);
});


// bubble coloring based on magnitude 
function coloring(mag) {
    return mag > 5 ? '#fe3f00' :
           mag > 4  ? '#fca330' :
           mag > 3 ? '#ecbe17' :
           mag > 2 ? '#fcdf6c' :
           mag > 1   ? '#f6de88' :
                      '#a0e88f';
}

function pullData(eqData) {

    var earthquakeData = L.geoJson(eqData, {

        onEachFeature: function (feature, layer){
            layer.bindPopup("<b>" + feature.properties.place + "</b>" + " - Magnitude: " + feature.properties.mag);
          },

        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng, {
                radius: (feature.properties.mag*50000),
                fillColor: coloring(feature.properties.mag),
                color: "clear",
                fillOpacity: .5     
          })
        }
      });

    generate(earthquakeData);
}

function generate(earthquakeData) {


    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ");

    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ");

    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ.T6YbdDixkOBWH_k9GbS8JQ");

    

    var mapChoices = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };

    
// Step 2
    var tectUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


    var tectPlatesLine = new L.layerGroup ();

    d3.json(tectUrl, function (tectData) {
        L.geoJson(tectData, {
            color: "orange",
            weight: 2
        })
        .addTo(tectPlatesLine);
    })

   
    var overlayChoices = {
        "Fault Lines" : tectPlatesLine,
        "Earthquakes" : earthquakeData  
    };

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [satellite, earthquakeData, tectPlatesLine]
    });

    
    L.control
        .layers(mapChoices, overlayChoices, {
            collapsed: false
        }).addTo(myMap);
}