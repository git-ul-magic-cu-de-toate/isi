require(["esri/config", 
  "esri/Map", 
  "esri/views/MapView", 
  
  "esri/widgets/Locate",
  "esri/widgets/Track",
  "esri/Graphic",
  
 "esri/layers/GraphicsLayer",
 
 "esri/layers/FeatureLayer",
 
 "esri/layers/GeoJSONLayer",
  
  "esri/layers/FeatureLayer",
  
  
  "esri/rest/route",
"esri/rest/support/RouteParameters",
"esri/rest/support/FeatureSet",
"esri/rest/locator",
"esri/core/reactiveUtils",
"esri/widgets/Search"
  
 ], 
 function(esriConfig, 
          Map, 
          MapView,
          
          Locate,
    Track,
    Graphic,
          
          GraphicsLayer,
          
          FeatureLayer,
          
            GeoJSONLayer,
          
          FeatureLayer,
          
          route, RouteParameters, FeatureSet,
          locator, reactiveUtils,
          Search
          
         ) {
// If GeoJSON files are not on the same domain as your website, a CORS enabled server
// or a proxy is required.
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Paste the url into a browser's address bar to download and view the attributes
// in the GeoJSON file. These attributes include:
// * mag - magnitude
// * type - earthquake or other event such as nuclear test
// * place - location of the event
// * time - the time of the event
// Use the Arcade Date() function to format time field into a human-readable format

const template = {
title: "Earthquake Info",
content: "Magnitude {mag} {type} hit {place} on {time}",
fieldInfos: [
  {
    fieldName: 'time',
    format: {
      dateFormat: 'short-date-short-time'
    }
  }
]
};

const renderer = {
type: "simple",
field: "mag",
symbol: {
  type: "simple-marker",
  color: "orange",
  outline: {
    color: "white"
  }
},
visualVariables: [{
  type: "size",
  field: "mag",
  stops: [{
      value: 2.5,
      size: "4px"
    },
    {
      value: 8,
      size: "40px"
    }
  ]
}]
};

const geojsonLayer = new GeoJSONLayer({
url: url,
copyright: "USGS Earthquakes",
popupTemplate: template,
renderer: renderer,
orderBy: {
  field: "mag"
}
});
// end tut 5
esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurD3614hU6avg5dgfJ0cyyj8cQ8C7k3IZRB6OnACsZ-rE1hULGhayhxdt3-DyiUZ3lkaYmzyQjvRTgl0Slvk8SyBIO2Segk7bmnRewIolBDbBOfOUyy3Vfc6BPl6s6SRn91vphbzw_QQpZuh5u0J_PHemWhTB0TDSod-Z_xeL7jaImuSKEazyI5GU80sve_kEVwagPYkxvSqX11IqMKvs2Ww.AT1_koIv1OGN";

const map = new Map({
  basemap: "arcgis/topographic", // basemap styles service
   layers: [geojsonLayer]
});

const view = new MapView({
  map: map,
  center: [-118.805, 34.027], // Longitude, latitude
  zoom: 13, // Zoom level
  container: "viewDiv" // Div element
});
const locate = new Locate({
  view: view,
  useHeadingEnabled: false,
  goToOverride: function(view, options) {
    options.target.scale = 1500;
    return view.goTo(options.target);
  }
});
view.ui.add(locate, "top-left");
// end tut 1
const track = new Track({
  view: view,
  graphic: new Graphic({
    symbol: {
      type: "simple-marker",
      size: "12px",
      color: "green",
      outline: {
        color: "#efefef",
        width: "1.5px"
      }
    }
  }),
  useHeadingEnabled: false
});
view.ui.add(track, "top-left");

// end tut 2
const graphicsLayer = new GraphicsLayer();
map.add(graphicsLayer);

const point = { //Create a point
type: "point",
longitude: -118.80657463861,
latitude: 34.0005930608889
};
const simpleMarkerSymbol = {
type: "simple-marker",
color: [226, 119, 40],  // Orange
outline: {
color: [255, 255, 255], // White
width: 1
}
};

const pointGraphic = new Graphic({
geometry: point,
symbol: simpleMarkerSymbol
});
graphicsLayer.add(pointGraphic);

// Create a line geometry
const polyline = {
type: "polyline",
paths: [
[-118.821527826096, 34.0139576938577], //Longitude, latitude
[-118.814893761649, 34.0080602407843], //Longitude, latitude
[-118.808878330345, 34.0016642996246]  //Longitude, latitude
]
};
const simpleLineSymbol = {
type: "simple-line",
color: [226, 119, 40], // Orange
width: 2
};

const polylineGraphic = new Graphic({
geometry: polyline,
symbol: simpleLineSymbol
});
graphicsLayer.add(polylineGraphic);

// Create a polygon geometry
const polygon = {
type: "polygon",
rings: [
[-118.818984489994, 34.0137559967283], //Longitude, latitude
[-118.806796597377, 34.0215816298725], //Longitude, latitude
[-118.791432890735, 34.0163883241613], //Longitude, latitude
[-118.79596686535, 34.008564864635],   //Longitude, latitude
[-118.808558110679, 34.0035027131376]  //Longitude, latitude
]
};

const simpleFillSymbol = {
type: "simple-fill",
color: [227, 139, 79, 0.8],  // Orange, opacity 80%
outline: {
color: [255, 255, 255],
width: 1
}
};

const popupTemplate = {
title: "{Name}",
content: "{Description}"
}
const attributes = {
Name: "Graphic",
Description: "I am a polygon"
}

const polygonGraphic = new Graphic({
geometry: polygon,
symbol: simpleFillSymbol,

attributes: attributes,
popupTemplate: popupTemplate

});
graphicsLayer.add(polygonGraphic);
// end tut 3

//Trailheads feature layer (points)
const trailheadsLayer = new FeatureLayer({
url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0"
});

map.add(trailheadsLayer);

//Trails feature layer (lines)
const trailsLayer = new FeatureLayer({
url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0"
});

map.add(trailsLayer, 0);

// Parks and open spaces (polygons)
const parksLayer = new FeatureLayer({
url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0"
});

map.add(parksLayer, 0);
// end tut 4

const trailheadsRenderer = {
"type": "simple",
"symbol": {
  "type": "picture-marker",
  "url": "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
  "width": "18px",
  "height": "18px"
}
}

const trailheadsLabels = {
symbol: {
  type: "text",
  color: "#FFFFFF",
  haloColor: "#5E8D74",
  haloSize: "2px",
  font: {
    size: "12px",
    family: "Noto Sans",
    style: "italic",
    weight: "normal"
  }
},

labelPlacement: "above-center",
labelExpressionInfo: {
  expression: "$feature.TRL_NAME"
}
};

// Create the layer and set the renderer
const trailheads = new FeatureLayer({
url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0",
renderer: trailheadsRenderer,
labelingInfo: [trailheadsLabels]
});

map.add(trailheads);

// Define a unique value renderer and symbols
const trailsRenderer = {
type: "simple",
symbol: {
  color: "#BA55D3",
  type: "simple-line",
  style: "solid"
},

visualVariables: [
  {
    type: "size",
    field: "ELEV_GAIN",
    minDataValue: 0,
    maxDataValue: 2300,
    minSize: "3px",
    maxSize: "7px"
  }
]
};

// Create the layer and set the renderer
const trails = new FeatureLayer({
url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
renderer: trailsRenderer,
opacity: 0.75
});

// Add the layer
map.add(trails,0);

// Add bikes only trails
const bikeTrailsRenderer = {
type: "simple",
symbol: {
  type: "simple-line",
  style: "short-dot",
  color: "#FF91FF",
  width: "1px"
}
};

const bikeTrails = new FeatureLayer({
url:
  "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0",
renderer: bikeTrailsRenderer,
definitionExpression: "USE_BIKE = 'YES'"
});

map.add(bikeTrails, 1);

// Add parks with a class breaks renderer and unique symbols
function createFillSymbol(value, color) {
return {
  "value": value,
  "symbol": {
    "color": color,
    "type": "simple-fill",
    "style": "solid",
    "outline": {
      "style": "none"
    }
  },
  "label": value
};
}

const openSpacesRenderer = {
type: "unique-value",
field: "TYPE",
uniqueValueInfos: [
  createFillSymbol("Natural Areas", "#9E559C"),
  createFillSymbol("Regional Open Space", "#A7C636"),
  createFillSymbol("Local Park", "#149ECE"),
  createFillSymbol("Regional Recreation Park", "#ED5151")
]
};

// Create the layer and set the renderer
const openspaces = new FeatureLayer({
url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0",
renderer: openSpacesRenderer,
opacity: 0.2
});

// Add the layer
map.add(openspaces,0);
// end tut 6

// Define a pop-up for Trailheads
const popupTrailheads2 = {
"title": "Trailhead",
"content": "<b>Trail:</b> {TRL_NAME}<br><b>City:</b> {CITY_JUR}<br><b>Cross Street:</b> {X_STREET}<br><b>Parking:</b> {PARKING}<br><b>Elevation:</b> {ELEV_FT} ft"
}

const trailheads2 = new FeatureLayer({
url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads_Styled/FeatureServer/0",
outFields: ["TRL_NAME","CITY_JUR","X_STREET","PARKING","ELEV_FT"],
popupTemplate: popupTrailheads2
});

map.add(trailheads2);

// Define a popup for Trails
const popupTrails2 = {
title: "Trail Information",
content: [{
 type: "media",
  mediaInfos: [{
    type: "column-chart",
    caption: "",
    value: {
      fields: [ "ELEV_MIN","ELEV_MAX" ],
      normalizeField: null,
      tooltipField: "Min and max elevation values"
      }
    }]
}]
}

const trails2 = new FeatureLayer({
url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0",
outFields: ["TRL_NAME","ELEV_GAIN"],
popupTemplate: popupTrails2
});

map.add(trails2,0);

// Define popup for Parks and Open Spaces
const popupOpenspaces2 = {
"title": "{PARK_NAME}",
"content": [{
  "type": "fields",
  "fieldInfos": [
    {
      "fieldName": "AGNCY_NAME",
      "label": "Agency",
      "isEditable": true,
      "tooltip": "",
      "visible": true,
      "format": null,
      "stringFieldOption": "text-box"
    },
    {
      "fieldName": "TYPE",
      "label": "Type",
      "isEditable": true,
      "tooltip": "",
      "visible": true,
      "format": null,
      "stringFieldOption": "text-box"
    },
    {
      "fieldName": "ACCESS_TYP",
      "label": "Access",
      "isEditable": true,
      "tooltip": "",
      "visible": true,
      "format": null,
      "stringFieldOption": "text-box"
    },

    {
      "fieldName": "GIS_ACRES",
      "label": "Acres",
      "isEditable": true,
      "tooltip": "",
      "visible": true,
      "format": {
        "places": 2,
        "digitSeparator": true
      },

      "stringFieldOption": "text-box"
    }
  ]
}]
}

const openspaces2 = new FeatureLayer({
url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0",
outFields: ["TYPE","PARK_NAME", "AGNCY_NAME","ACCESS_TYP","GIS_ACRES","TRLS_MI","TOTAL_GOOD","TOTAL_FAIR", "TOTAL_POOR"],
popupTemplate: popupOpenspaces2
});

map.add(openspaces2,0);
// end tut 7 

// end lab 2

const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

view.on("click", function(event){
let point = esri.Point;
Point = elem.results.find(e => e.layer === this.trailheadsLayer)?.mapPoint;
if (Point) {
addGraphic("origin", event.mapPoint);
}
if (view.graphics.length === 0) {
addGraphic("origin", event.mapPoint);
} else if (view.graphics.length === 1) {
addGraphic("destination", event.mapPoint);

getRoute(); // Call the route service

} else {
view.graphics.removeAll();
addGraphic("origin",event.mapPoint);
}

});

function addGraphic(type, point) {
const graphic = new Graphic({
symbol: {
  type: "simple-marker",
  color: (type === "origin") ? "white" : "black",
  size: "8px"
},
geometry: point
});
view.graphics.add(graphic);
}

function getRoute() {
const routeParams = new RouteParameters({
stops: new FeatureSet({
  features: view.graphics.toArray()
}),

returnDirections: true

});

route.solve(routeUrl, routeParams)
.then(function(data) {
  data.routeResults.forEach(function(result) {
    result.route.symbol = {
      type: "simple-line",
      color: [5, 150, 255],
      width: 3
    };
    view.graphics.add(result.route);
  });

  // Display directions
 if (data.routeResults.length > 0) {
   const directions = document.createElement("ol");
   directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
   directions.style.marginTop = "0";
   directions.style.padding = "15px 15px 15px 30px";
   const features = data.routeResults[0].directions.features;

   // Show each direction
   features.forEach(function(result,i){
     const direction = document.createElement("li");
     direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
     directions.appendChild(direction);
   });

  view.ui.empty("top-right");
  view.ui.add(directions, "top-right");

 }

})

.catch(function(error){
    console.log(error);
})

}
// end tut 1

const places = ["Choose a place type...", "Parks and Outdoors", "Coffee shop", "Gas station", "Food", "Hotel"];

const select = document.createElement("select");
select.setAttribute("class", "esri-widget esri-select");
select.setAttribute("style", "width: 175px; font-family: 'Avenir Next W00'; font-size: 1em");

places.forEach((p) => {
  const option = document.createElement("option");
  option.value = p;
  option.innerHTML = p;
  select.appendChild(option);
});

view.ui.add(select, "top-left");

const locatorUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

// Find places and add them to the map
function findPlaces(category, pt) {
  locator
    .addressToLocations(locatorUrl, {
      location: pt,
      categories: [category],
      maxLocations: 25,
      outFields: ["Place_addr", "PlaceName"]
    })

    .then((results) => {
      view.closePopup();
      view.graphics.removeAll();

      results.forEach((result) => {
        view.graphics.add(
          new Graphic({
            attributes: result.attributes, // Data attributes returned
            geometry: result.location, // Point returned
            symbol: {
              type: "simple-marker",
              color: "#000000",
              size: "12px",
              outline: {
                color: "#ffffff",
                width: "2px"
              }
            },

            popupTemplate: {
              title: "{PlaceName}", // Data attribute names
              content: "{Place_addr}"
            }
          })
        );
      });

    });

}
// end tut 2

// Search for places in center of map
reactiveUtils.when(
  () => view.stationary,
  () => {
    findPlaces(select.value, view.center);
  }
);

// Listen for category changes and find places
select.addEventListener("change", (event) => {
  findPlaces(event.target.value, view.center);
});

const search = new Search({  //Add Search widget
view: view
});

view.ui.add(search, "top-left"); //Add to the map
// end tut 3
// end lab3  

});
