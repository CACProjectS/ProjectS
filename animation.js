var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var state = 'view';

// Set up scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const origin = new THREE.Vector3(0, 0, 0);
const xAxis = new THREE.Vector3(1, 0, 0);
const yAxis = new THREE.Vector3(0, 1, 0);
const zAxis = new THREE.Vector3(0, 0, 1);


(function() {
    var dist = 2;
    var theta;
    var phi;
    var light;
    for (var i = 0; i < 30; i ++) {
        theta = Math.random() * Math.PI * 2;
        phi = Math.random() * Math.PI;

        var light = new THREE.PointLight(0xffffff, 0.5, 10000);
        light.position.set(0, 0, dist);
        light.position.applyAxisAngle(xAxis, theta);
        light.position.applyAxisAngle(yAxis, phi);

        scene.add(light);
    }
})()

const whratio = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight, 0.01, 10000000);
var cameraStart = new THREE.Vector3(10500, -2500, 1000);
camera.position.copy(cameraStart);
//camera.up = new THREE.Vector3(-0.75, -0.1, 1);
camera.up = new THREE.Vector3(0, 0, 1);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableKeys = false;

//camera.position.set(0, 0, -1000);
controls.update()

var maxZoomFrames = 120;
var zoomFrames = 0;
var zoomCounter = 0;
var zoomPosStart = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
var zoomPosEnd = new THREE.Vector3(215, 0, 0);
//var zoomPosEnd = new THREE.Vector3(0, 0, 0);
var zoomPosDifferential = new THREE.Vector3();
var zoomViewStart = new THREE.Vector3(0, 0, 0);
var zoomViewEnd = new THREE.Vector3(215, 0, 0);
//var zoomViewEnd = new THREE.Vector3(0, 0, 0);
var zoomViewCurr = new THREE.Vector3(0, 0, 0);
var zoomViewDifferential = new THREE.Vector3();

var zoomIn = true;

var solarSystemSetup = [
    {
        name: 'The Sun',
        dist: 0,
        diameter: 864938
    },
    {
        name: 'Mercury',
        dist: 83,
        diameter: 3032,
        scale: 0.00033811
    },
    {
        name: 'Venus',
        dist: 156,
        diameter: 7
    },
    {
        name: 'Earth',
        dist: 215,
        scale: 0.00088675
    },
    {
        name: 'Mars',
        dist: 328
    },
    {
        name: 'Jupiter',
        dist: 1119
    },
    {
        name: 'Saturn',
        dist: 2061
    },
    {
        name: 'Uranus',
        dist: 4128
    },
    {
        name: 'Neptune',
        dist: 6463
    },
];

var orbits = [];
(function() {
    var orbit;
    var setup;
    var orbitGeometry;
    var orbitMaterial = new THREE.LineBasicMaterial({color: 0x007f3f});
    for (var i in solarSystemSetup) {
        setup = solarSystemSetup[i];

        // Add the orbits
        if (setup.dist > 0) {
            orbitGeometry = new THREE.CircleGeometry(setup.dist, 5000);
            orbitGeometry.vertices[0] = orbitGeometry.vertices[orbitGeometry.vertices.length - 1];
            orbit = new THREE.Line(orbitGeometry, orbitMaterial);

            orbits.push(orbit);
            scene.add(orbit);
        }
    }
}) ()

var currPlanet = new THREE.Scene();
scene.add(currPlanet);

var models = {};
(function() {
    let loader = new GLTFLoader();
    loader.load('./CAC Planets/Milky Way/scene.gltf', function(draw) {
        var bg = draw.scene.children[0];
        bg.scale.set(100, 100, 100);

        //scene.add(draw.scene);
    });
    loader.load('./CAC Planets/Sun/scene.gltf', function(draw){
        var sun = draw.scene.children[0];
        var scale = 0.09639;
        sun.scale.set(scale, scale, scale);

        //scene.add(draw.scene);
    });
    loader.load('./CAC Planets/Earth/scene.gltf', function(draw){
        var earth = draw.scene.children[0];
        var scale = 0.00088675;
        earth.scale.set(scale, scale, scale);
        earth.position.set(-scale, -scale * 0.8125, -scale);

        earth.rotation.x += Math.PI / 2;
        earth.rotation.z += Math.PI / 2;
        earth.position.set(215-scale, -scale * 0.8125, -scale);

        models.Earth = draw.scene;
        draw.scene.visible = false;
        scene.add(draw.scene);
    });
}) ()

var cameraVector = camera.getWorldDirection(cameraVector);


function bellCurve(curr, max) {
    var map = (curr / max) * 6 - 3;
    return Math.exp(-map * map) / Math.sqrt(Math.PI);
}
function animate() {
    //for (var obj in 

    if (state == 'zoom') {
        controls.enableRotate = false;
        zoomFrames ++;
        zoomCounter = bellCurve(zoomFrames, maxZoomFrames);

        zoomPosDifferential.subVectors(zoomPosEnd, zoomPosStart);
        zoomPosDifferential.multiplyScalar(zoomCounter * 6 / maxZoomFrames * /*0.9995*/1.00001875);
        zoomViewDifferential.subVectors(zoomViewEnd, zoomViewStart);
        zoomViewDifferential.multiplyScalar(zoomCounter * 6 / maxZoomFrames);
        
        camera.position.add(zoomPosDifferential);
        zoomViewCurr.add(zoomViewDifferential);

        controls.target = zoomViewCurr;

        if (zoomFrames >= maxZoomFrames) {
            zoomViewCurr.copy(zoomViewEnd);

            //camera.position.copy(zoomPosEnd);
            controls.target = zoomViewEnd;

            zoomFrames = 0;
            controls.enableRotate = true;

            state = 'view';
            if (zoomIn) {
                infoText(830, 700);
            }

            zoomIn = !zoomIn;
        }
    }
    else if (state == 'view') {
    }
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
	controls.update();
}
animate();

var startZoom = function(planet) {
    var planetModel = models[planet];
    zoomPosStart = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    zoomPosEnd = new THREE.Vector3(215, 0, 0);
    zoomViewStart = new THREE.Vector3(0, 0, 0);
    zoomViewEnd = new THREE.Vector3(215, 0, 0);
    zoomViewCurr = new THREE.Vector3(0, 0, 0);

    zoomIn = true;
    state = 'zoom';

    document.getElementById('zoomButton').style.display = 'none';
}
