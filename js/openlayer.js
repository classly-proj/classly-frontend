// Define the extent of the floor plan image in map coordinates
const imageExtent = [0, 0, 1000, 647]; // Adjust these values to fit your image size

// Create an ImageStatic layer with the JPEG floor plan
const floorPlanLayer = new ol.layer.Image({
  source: new ol.source.ImageStatic({
    url: './img/PaulCollegeGround.jpg', // Replace with the path to your JPEG file
    projection: 'EPSG:4326',
    imageExtent: imageExtent,
  }),
});

// Initialize the map with the image layer
const map = new ol.Map({
  target: 'map',
  layers: [floorPlanLayer],
  view: new ol.View({
    projection: 'EPSG:4326',
    center: ol.extent.getCenter(imageExtent), // Center the view on the image
    zoom: 0, // Adjust the zoom level to fit your needs
    maxZoom: 5,
  }),
});

// Define waypoints (adjust coordinates based on image)
const waypoints = {
  entrance: [208.828125, 449.296875],
  intersection1: [400, 700],
  intersection2: [400, 500],
  classroomA: [600, 500],
  classroomB: [800, 500]
};

// Define paths as an adjacency list
const paths = {
  entrance: ['intersection1'],
  intersection1: ['entrance', 'intersection2'],
  intersection2: ['intersection1', 'classroomA', 'classroomB'],
  classroomA: ['intersection2'],
  classroomB: ['intersection2']
};

// Path-finding function (simple breadth-first search for demonstration)
function findPath(start, end) {
  const queue = [[start]];
  const visited = new Set();
  visited.add(start);

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === end) return path;

    for (const neighbor of paths[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}

// Draw the path on the map
function drawPath(path) {
  const coordinates = path.map(point => waypoints[point]);
  const routeFeature = new ol.Feature({
    geometry: new ol.geom.LineString(coordinates),
  });
  routeFeature.setStyle(new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#ff0000',
      width: 3,
    }),
  }));

  const vectorSource = new ol.source.Vector({
    features: [routeFeature]
  });
  const vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });
  map.addLayer(vectorLayer);
}

// Example: Find path from 'entrance' to 'classroomA' and draw it
const path = findPath('entrance', 'classroomA');
if (path) {
  drawPath(path);
} else {
  console.log('No path found');
}

// Optional: Add a click event to get the coordinates of points on the map
map.on('click', function(evt) {
  const coordinates = evt.coordinate;
  console.log('Clicked at:', coordinates);
});

// Debugging: Log map load success
map.on('postrender', () => {
  console.log('Map loaded successfully');
});