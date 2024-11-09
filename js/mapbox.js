mapboxgl.accessToken =
  "pk.eyJ1IjoiZHNjYXJiMjEiLCJhIjoiY2x0cnR3cWlqMGtmZzJucDU2eDR2eWpyMCJ9.nfk8bnbhwkUmEHDhKZv3zA";

const bounds = [
  [-70.956425, 43.118725],
  [-70.894926, 43.154229],
];

const map = new mapboxgl.Map({
  container: "mapbox",
  style: "mapbox://styles/mapbox/streets-v12",
  zoom: 12,
  center: [-70.9256, 43.13401],
  maxBounds: bounds,
});

const start = [-70.930745, 43.152942];

<<<<<<< HEAD
async function loadRoute(end) {
=======
const bd_PAUL = [
  {
    // GROUND FLOOR
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: "FL_0_Ent_1" },
        geometry: {
          type: "Point",
          coordinates: [-70.92921445683932, 43.136601522479374],
        },
      },
      {
        type: "Feature",
        properties: { id: "FL_0_Ent_2" },
        geometry: {
          type: "Point",
          coordinates: [-70.92905657465109, 43.13661551234659],
        },
      },
      {
        type: "Feature",
        properties: { id: "FL_0_Ent_2" },
        geometry: {
          type: "Point",
          coordinates: [-70.92905657465109, 43.13661551234659],
        },
      },
    ],
  },
  {
    // FLOOR 1
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: "FL_1_Ent_1" },
        geometry: { type: "Point", coordinates: [-70.928859, 43.136652] },
      },
    ],
  },
];

async function getRoute(end) {
>>>>>>> 433cf6ee7f55fb79d9f842cd4b6bf451b126635c
  const targetUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]}%2C${start[1]}%3B${end[0]}%2C${end[1]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiZHNjYXJiMjEiLCJhIjoiY2x0cnR1Y254MGkxdzJqbnZ2bHowcHN1MiJ9.TSvhTRQ2X-G0M-mzagneOw`;

  const query = await fetch(targetUrl);
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: route,
    },
  };

  if (map.getSource("route")) {
    map.getSource("route").setData(geojson);
  } else {
    map.addLayer({
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: geojson,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.75,
      },
    });
  }
}

<<<<<<< HEAD
function loadBuildings(buildings) {
  const allFeatures = [];
  for (const floor in buildings.paul) {
    if (buildings.paul.hasOwnProperty(floor)) {
      buildings.paul[floor].forEach((entry) => {
        allFeatures.push({
          type: 'Feature',
          properties: {
            floor: floor
          },
          geometry: {
            type: 'Point',
            coordinates: entry.coordinates
          }
        });
      });
    }
  }

  // Combine all features into a single FeatureCollection
  const combinedData = {
    type: 'FeatureCollection',
    features: allFeatures
  };

  // Add the combined GeoJSON source to the map
  map.addSource('combined_buildings', {
    type: 'geojson',
    data: combinedData
=======
function setupBuildingLayer() {
  map.addSource("buildings", {
    type: "geojson",
    data: buildings,
>>>>>>> 433cf6ee7f55fb79d9f842cd4b6bf451b126635c
  });

  // Add the layer using the combined source
  map.addLayer({
<<<<<<< HEAD
    id: 'buildings',
    type: 'circle',
    source: 'combined_buildings',
=======
    id: "buildings",
    type: "circle",
    source: "buildings",
>>>>>>> 433cf6ee7f55fb79d9f842cd4b6bf451b126635c
    paint: {
      "circle-radius": 8,
      "circle-color": "#ff8c00",
    },
  });

  map.on("click", "buildings", function (e) {
    const coordinates = e.features[0].geometry.coordinates;
    loadRoute(coordinates);
  });

  map.on("mouseenter", "buildings", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "buildings", function () {
    map.getCanvas().style.cursor = "";
  });
}

map.on("load", () => {
  map.addLayer({
    id: "point",
    type: "circle",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: start,
            },
          },
        ],
      },
    },
    paint: {
      "circle-radius": 10,
      "circle-color": "#3887be",
    },
  });

  fetch('./data/buildings.json') 
      .then(response => response.json())
      .then(buildings => {
        loadBuildings(buildings);
      })
      .catch(error => console.error('Error loading the JSON file:', error));
});
