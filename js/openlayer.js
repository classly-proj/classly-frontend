/**
 * Code related to openlayer floor maps
 */

var map = null;
const buildingMapContainer = document.getElementById("openlayer-container");
const buildingMap = document.getElementById("openlayer-map");

/**
 * Displays floor map of given building
 *
 * @param {string} building Name of building to show floor map
 */
export function toggleBuildingMap(building) {
    const build = sessionStorage.getItem("building");
    const room = sessionStorage.getItem("room");

    // Close building map if open
    if (buildingMapContainer.classList.length === 0) {
        buildingMapContainer.classList.add("hidden");
        buildingMap.replaceChildren();
        return;
    }

    console.log(building);
    buildingMapContainer.classList.remove("hidden");

    const imageExtent = [0, 0, 1000, 647];
    map = new ol.Map({
        target: "openlayer-map",
        layers: [],
        view: new ol.View({
            center: ol.extent.getCenter(imageExtent),
            zoom: 20,
        }),
    });

    const ground = {
        waypoints: {
            entrance: [180, 450],
            waypnt1: [723, 450],
            stairs1: [586, 450],
            stairs: [586, 500],
            elevator1: [680, 450],
            elevator: [680, 480],
            intera: [287, 450],
            G25: [287, 500],
            interb: [544, 450],
            G45: [544, 500],
            interc: [725, 460],
            classc: [725, 580],
            interd: [723, 243],
            G85: [760, 243],
            intere: [723, 190],
            classe: [760, 190],
            interf: [723, 85],
            G93: [760, 85],
            G75: [800, 450],
        },
        paths: {
            entrance: ["intera"],
            waypnt1: ["interd", "interc", "elevator1", "G75"],
            elevator1: ["waypnt1", "stairs1", "elevator"],
            elevator: ["elevator1"],
            stairs1: ["elevator1", "interb", "stairs"],
            stairs: ["stairs1"],
            intera: ["entrance", "G25", "interb"],
            G25: ["intera"],
            interb: ["intera", "stairs1", "G45"],
            G45: ["interb"],
            interc: ["waypnt1", "classc"],
            classc: ["interc"],
            interd: ["intere", "waypnt1", "G85"],
            G85: ["interd"],
            intere: ["interf", "interd", "classe"],
            classe: ["intere"],
            interf: ["intere", "G93"],
            G93: ["interf"],
            G75: ["waypnt1"],
        },
    };

    const first = {
        waypoints: {
            waypnt1: [830, 445],
            stairs1: [690, 445],
            stairs: [690, 500],
            elevator1: [785, 445],
            elevator: [785, 475],
            intera: [325, 445],
            115: [325, 500],
            interb: [462, 450],
            125: [462, 500],
            interc: [575, 445],
            135: [575, 500],
            interd: [830, 382],
            165: [870, 382],
            intere: [830, 238],
            175: [870, 238],
            interf: [830, 78],
            185: [870, 78],
        },
        paths: {
            waypnt1: ["interd", "interc", "elevator1"],
            elevator1: ["waypnt1", "stairs1", "elevator"],
            elevator: ["elevator1"],
            stairs1: ["elevator1", "interb", "stairs"],
            stairs: ["stairs1"],
            intera: ["115", "interb"],
            115: ["intera"],
            interb: ["intera", "stairs1", "125"],
            125: ["interb"],

            interc: ["waypnt1", "135"],
            135: ["interc"],

            interd: ["intere", "waypnt1", "165"],
            165: ["interd"],

            intere: ["interf", "interd", "175"],
            175: ["intere"],

            interf: ["intere", "185"],
            185: ["interf"],
        },
    };

    const second = {
        waypoints: {
            waypnt1: [830, 445],
            stairs1: [690, 445],
            stairs: [690, 500],
            elevator1: [785, 445],
            elevator: [785, 475],
            intera: [325, 445],
            215: [325, 500],
            interb: [464, 445],
            225: [464, 500],
            interc: [597, 445],
            235: [597, 500],
            interd: [236, 445],
            205: [236, 500],
        },
        paths: {
            elevator1: ["elevator", "stairs1"],
            elevator: ["elevator1"],

            stairs1: ["stairs", "elevator1", "interc"],
            stairs: ["stairs1"],

            intera: ["215", "interb", "interd"],
            215: ["intera"],

            interb: ["225", "intera", "interc"],
            225: ["interb"],

            interc: ["235", "interb", "stairs1"],
            235: ["interc"],

            interd: ["205", "intera"],
            205: ["interd"],
        },
    };

    const gurl = "./img/PaulCollegeGround.jpg";

    const furl = "./img/PaulCollegeFirst.jpg";

    const surl = "./img/PaulCollegeSecond.jpg";

    if (build == "PCBE") {
        if (room[0] == "G") {
            document.getElementById("nav").style.visibility = "hidden";
            createMap(ground, gurl, "entrance", room);
        } else if (room[0] == "1") {
            const mapped = createMap(ground, gurl, "entrance", "stairs");
            document.getElementById("nav").style.visibility = "visible";
            document
                .getElementById("nav")
                .addEventListener("click", function () {
                    mapped.getLayers().clear();
                    createMap(first, furl, "stairs", room);
                });
        } else if (room[0] == "2") {
            var num = 1;
            const mapped = createMap(ground, gurl, "entrance", "stairs");
            document.getElementById("nav").style.visibility = "visible";
            document
                .getElementById("nav")
                .addEventListener("click", function () {
                    if (num == 1) {
                        mapped.getLayers().clear();
                        createMap(first, furl, "stairs", room);
                    } else {
                        mapped.getLayers().clear();
                        createMap(second, surl, "stairs", room);
                    }
                    num = num + 1;
                });
        }
    } else {
        document.getElementById("deny").style.display = "block";
    }
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
    const coordinates = path.map((point) => waypoints[point]);
    const line = new ol.geom.LineString(coordinates);
    const routeFeature = new ol.Feature({
        geometry: line,
    });
    routeFeature.setStyle(
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#ff0000",
                width: 3,
                lineDash: [10, 10],
            }),
        })
    );

    const vectorSource = new ol.source.Vector({
        features: [routeFeature],
    });

    if (coordinates.length > 1) {
        const end = coordinates[coordinates.length - 1];

        const xFeature = new ol.Feature({
            geometry: new ol.geom.Point(end),
        });

        xFeature.setStyle(
            new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="red" d="M3 3L21 21M3 21L21 3" stroke="red" stroke-width="2"/></svg>',
                    anchor: [0.5, 0.5],
                    scale: 1,
                }),
            })
        );
        vectorSource.addFeature(xFeature);
    }

    pathLayer = new ol.layer.Vector({
        source: vectorSource,
    });
    map.addLayer(pathLayer);
    return map;
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

    const path = findPath(start, dest, floor["paths"]);
    if (path) {
        map = drawPath(map, path, floor["waypoints"]);
    } else {
        console.log("No path found");
    }

    // map.on("click", function (evt) {
    //     const coordinates = evt.coordinate;
    //     console.log("Clicked at:", coordinates);
    // });

    return map;
}
