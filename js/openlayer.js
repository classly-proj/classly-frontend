

let pathLayer = null;
    const imageExtent = [0, 0, 1000, 647]; 

    const floorPlanLayer = new ol.layer.Image({
      source: new ol.source.ImageStatic({
        url: './img/PaulCollegeGround.jpg',
        imageExtent: imageExtent,
      }),
    });

    // Initialize the map with the image layer
    const map = new ol.Map({
      target: 'map',
      layers: [floorPlanLayer],
      view: new ol.View({
        center: ol.extent.getCenter(imageExtent), 
        zoom: 20, // Adjust the zoom level to fit your needs
      }),
    });

    ground = {
        "waypoints": {
            "entrance": [180, 450],
            "waypnt1": [723, 450],
            "stairs1": [586, 450],
            "stairs": [586, 500],
            "elevator1": [680, 450],
            "elevator": [680, 480],
            "intera": [287, 450],
            "classa": [287, 500],
            "interb": [544, 450],
            "classb": [544, 500],
            "interc": [725, 460],
            "classc": [725, 580],
            "interd": [723, 243],
            "classd": [760, 243],
            "intere": [723, 190],
            "classe": [760, 190],
            "interf": [723, 85],
            "classf": [760, 85],
            "classg": [800, 450]
        },
        "paths": {
            "entrance": ["intera"],
            "waypnt1": ["interd", "interc", "elevator1", "classg"],
            "elevator1": ["waypnt1", "stairs1", "elevator"],
            "elevator": ["elevator1"],
            "stairs1": ["elevator1", "interb", "stairs"],
            "stairs": ["stairs1"],
            "intera": ["entrance", "classa", "interb"],
            "classa": ["intera"],
            "interb": ["intera", "stairs1", "classb"],
            "classb": ["interb"],
            "interc": ["waypnt1", "classc"],
            "classc": ["interc"],
            "interd": ["intere", "waypnt1", "classd"],
            "classd": ["interd"],
            "intere": ["interf", "interd", "classe"],
            "classe": ["intere"],
            "interf": ["intere", "classf"],
            "classf": ["interf"],
            "classg": ["waypnt1"]
        }
    }





    map.getView().fit(imageExtent, { size: map.getSize() });

    // Path-finding function (simple breadth-first search for demonstration)
    function findPath(start, end, paths) {
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


    function drawPath(path, waypoints) {
    if (pathLayer) {
        map.removeLayer(pathLayer);
    }

    const coordinates = path.map(point => waypoints[point]);
    const line = new ol.geom.LineString(coordinates);
    const routeFeature = new ol.Feature({
        geometry: line,
    });

    routeFeature.setStyle(new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#ff0000',
            width: 3,
            lineDash: [10, 10] 
        }),
    }));

    const vectorSource = new ol.source.Vector({
        features: [routeFeature],
    });

    // Add an "X" icon at the end of the path
    if (coordinates.length > 1) {
        const end = coordinates[coordinates.length - 1];

        const xFeature = new ol.Feature({
            geometry: new ol.geom.Point(end),
        });

        xFeature.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                src: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" d="M3 3L21 21M3 21L21 3" stroke="red" stroke-width="2"/></svg>',
                anchor: [0.5, 0.5],
                scale: 1 // Make the "X" bigger
            })
        }));

        vectorSource.addFeature(xFeature);
    }

    pathLayer = new ol.layer.Vector({
        source: vectorSource
    });

    map.addLayer(pathLayer);
}

    const path = findPath('classf', 'classb', ground['paths']);
    if (path) {
      drawPath(path, ground['waypoints']);
    } else {
      console.log('No path found');
    }
     // Global variable to keep track of the path layer


    // Optional: Add a click event to get the coordinates of points on the map
    map.on('click', function(evt) {
      const coordinates = evt.coordinate;
      console.log('Clicked at:', coordinates);
    });

    // Debugging: Log map load success
    map.on('postrender', () => {
      console.log('Map loaded successfully');
    });