import { loadDirections } from "./api/mapbox.js";

const bounds = [
  [-70.956425, 43.118725], 
  [-70.894926, 43.154229],
];

mapboxgl.accessToken = "pk.eyJ1IjoiZHNjYXJiMjEiLCJhIjoiY2x0cnR3cWlqMGtmZzJucDU2eDR2eWpyMCJ9.nfk8bnbhwkUmEHDhKZv3zA";


const map = new mapboxgl.Map({
  container: "mapbox", 
  style: "mapbox://styles/mapbox/streets-v12",
  zoom: 12, 
  center: [-70.92560, 43.13401],
  maxBounds: bounds, 
});

const start = [-70.930745,43.152942];

async function loadRoute(end) {
  const response = await loadDirections(start[0], start[1], end[0], end[1]);

  if (!response.ok) {
    console.error('Error loading directions:', response.getStatusName());
    return;
  }

  const json = response.data;
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };

  if (map.getSource('route')) {
    map.getSource('route').setData(geojson);
  } else {
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }
}

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
  });

  // Add the layer using the combined source
  map.addLayer({
    id: 'buildings',
    type: 'circle',
    source: 'combined_buildings',
    paint: {
      'circle-radius': 8,
      'circle-color': '#ff8c00'
    }
  });

  map.on('click', 'buildings', function (e) {
    const coordinates = e.features[0].geometry.coordinates;
    loadRoute(coordinates);
  });

  map.on('mouseenter', 'buildings', function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'buildings', function () {
    map.getCanvas().style.cursor = '';
  });
}

map.on('load', () => {
  map.addLayer({
    id: 'point',
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: start
            }
          }
        ]
      }
    },
    paint: {
      'circle-radius': 10,
      'circle-color': '#3887be'
    }
  });

  fetch('./data/buildings.json') 
      .then(response => response.json())
      .then(buildings => {
        loadBuildings(buildings);
      })
      .catch(error => console.error('Error loading the JSON file:', error));
});
