slctcourse = {
    "TERM_CRN": "20241012980",
    "COURSE_DATA": {
        "SYVSCHD_CRSE_LONG_TITLE": "Survey of Accounting",
        "SYVSCHD_SUBJ_CODE": "ACC",
        "SYVSCHD_CRSE_NUMB": "501",
        "SYVSCHD_CRSE_DESC": "Survey of basic accounting concepts, including exposure to financial statements, accounting processes, decision making, and budgeting. This course is designed for students pursuing a Business Administration minor, a minor in Accounting and Financial Information or exploring basic accounting. Not for Paul College Business Administration students.",
        "INSTRUCTORS": [
            {
                "LAST_NAME": "Robinson",
                "FIRST_NAME": "Ian",
                "EMAIL": "Ian.Robinson@unh.edu"
            }
        ],
        "MEETINGS": [
            {
                "DAYS": "T",
                "BUILDING": "PCBE",
                "ROOM": "185",
                "TIME": "5:10pm - 8:00pm"
            },
            {
                "DAYS": "W",
                "BUILDING": "PCBE",
                "ROOM": "185",
                "TIME": "6:00pm - 8:00pm"
            }
        ]
    }
}

// room = parseInt(slctcourse["COURSE_DATA"]["MEETINGS"][0]["ROOM"])
room = "227"
var map = null;


const imageExtent = [0, 0, 1000, 647];
map = new ol.Map({
    target: 'map',
    layers: [],
    view: new ol.View({
    center: ol.extent.getCenter(imageExtent), 
    zoom: 20,
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

first = {
    "waypoints": {
        "waypnt1": [830, 445],
        "stairs1": [690, 445],
        "stairs": [690, 500],
        "elevator1": [785, 445],
        "elevator": [785, 475],
        "intera": [325, 445],
        "classa": [325, 500],
        "interb": [462, 450],
        "classb": [462, 500],
        "interc": [575, 445],
        "classc": [575, 500],
        "interd": [830, 382],
        "classd": [870, 382],
        "intere": [830, 238],
        "classe": [870, 238],
        "interf": [830, 78],
        "classf": [870, 78],
    },
    "paths": {
        "waypnt1": ["interd", "interc", "elevator1"],
        "elevator1": ["waypnt1", "stairs1", "elevator"],
        "elevator": ["elevator1"],
        "stairs1": ["elevator1", "interb", "stairs"],
        "stairs": ["stairs1"],
        "intera": ["classa", "interb"],
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
    }
}

second = {
    "waypoints": {
        "waypnt1": [830, 445],
        "stairs1": [690, 445],
        "stairs": [690, 500],
        "elevator1": [785, 445],
        "elevator": [785, 475],
        "intera": [325, 445],
        "classa": [325, 500],
        "interb": [464, 445],
        "classb": [464, 500],
        "interc": [597, 445],
        "classc": [597, 500],
        "interd": [236, 445],
        "classd": [236, 500],
    },
    "paths": {
        "elevator1": ["elevator", "stairs1"],
        "elevator": ["elevator1"],

        "stairs1": ["stairs", "elevator1", "interc"],
        "stairs": ["stairs1"],

        "intera": ["classa", "interb", "interd"],
        "classa": ["intera"],

        "interb": ["classb", "intera", "interc"],
        "classb": ["interb"],

        "interc": ["classc", "interb", "stairs1"],
        "classc": ["interc"],

        "interd": ["classd", "intera"],
        "classd": ["interd"],
    }
}

gurl = './img/PaulCollegeGround.jpg'

furl = './img/PaulCollegeFirst.jpg'

surl = './img/PaulCollegeSecond.jpg'



if (room[0] == "G") {
    createMap(ground, gurl, "entrance", "classa")
} else if  (room[0] == "1") {
    mapped = createMap(ground, gurl, "entrance", "stairs")
    document.getElementById('nav').addEventListener('click', function(){
        mapped.getLayers().clear();
        createMap(first, furl, "stairs", "classa")
        console.log(mapped.getLayers())
    })
} else {
    mapped = createMap(ground, gurl, "entrance", "stairs")
    document.getElementById('nav').addEventListener('click', function(){
        mapped.getLayers().clear();
        createMap(second, surl, "stairs", "classa")
        console.log(mapped.getLayers())
    })
}





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


function drawPath(map, path, waypoints) {
    let pathLayer = null;
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

if (coordinates.length > 1) {
    const end = coordinates[coordinates.length - 1];

    const xFeature = new ol.Feature({
        geometry: new ol.geom.Point(end),
    });

    xFeature.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            src: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" d="M3 3L21 21M3 21L21 3" stroke="red" stroke-width="2"/></svg>',
            anchor: [0.5, 0.5],
            scale: 1 
        })
    }));
    vectorSource.addFeature(xFeature);
}

pathLayer = new ol.layer.Vector({
    source: vectorSource
});
map.addLayer(pathLayer);
return map
}


function createMap(floor, imgurl, start, dest) {

const imageExtent = [0, 0, 1000, 647]; 

const floorPlanLayer = new ol.layer.Image({
    source: new ol.source.ImageStatic({
    url: imgurl,
    imageExtent: imageExtent,
    }),
});

map.addLayer(floorPlanLayer);

map.getView().fit(imageExtent, { size: map.getSize() });

const path = findPath(start, dest, floor['paths']);
if (path) {
    map = drawPath(map, path, floor['waypoints']);
} else {
    console.log('No path found');
}

map.on('click', function(evt) {
    const coordinates = evt.coordinate;
    console.log('Clicked at:', coordinates);
});

map.on('postrender', () => {
    console.log('Map loaded successfully');
});

return map;
}