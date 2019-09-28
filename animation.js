import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var state = 'zoom';

// Set up scene
var scene = new THREE.Scene();
//scene.fog = new THREE.Fog(0x000000, 0, 20000);
var origin = new THREE.Vector3(0, 0, 0);

const whratio = window.innerWidth/window.innerHeight;
var camera = new THREE.OrthographicCamera(-3000 * whratio, 3000 * whratio, -3000, 3000, -5000, 64000);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

camera.position.set(-100, 2500, 1000);
controls.update()

var maxZoomFrames = 120;
var zoomFrames = 0;
var zoomCounter = 0;
var zoomPosStart = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
var zoomPosEnd = new THREE.Vector3(215, 0, 0);
var zoomPosDifferential = new THREE.Vector3();
var zoomViewStart = new THREE.Vector3(0, 0, 0);
var zoomViewEnd = new THREE.Vector3(215, 0, 0);
var zoomViewCurr = new THREE.Vector3(0, 0, 0);
var zoomViewDifferential = new THREE.Vector3();
var zoomZoomStart = camera.zoom;
var zoomZoomEnd = 150;

var zoom2Start = zoomZoomEnd;
var zoom2End = 100000;

var zoomIn = true;

var solarSystemSetup = [
    {
        x: 0,
        y: 0,
        z: 0
    },
    {
        x: 83,
        y: 0,
        z: 0
    },
    {
        x: 156,
        y: 0,
        z: 0
    },
    {
        x: 215,
        y: 0,
        z: 0
    },
    {
        x: 328,
        y: 0,
        z: 0
    },
    {
        x: 1119,
        y: 0,
        z: 0
    },
    {
        x: 2061,
        y: 0,
        z: 0
    },
    {
        x: 4128,
        y: 0,
        z: 0
    },
    {
        x: 6463,
        y: 0,
        z: 0
    },
];
var solarSystem = [];
var orbits = [];
var planet;
var orbit;

var setup;
var orbitGeometry;
var orbitMaterial = new THREE.LineBasicMaterial({color: 0x007f3f});
for (var i in solarSystemSetup) {
    setup = solarSystemSetup[i];

    // Add the orbits
    if (setup.x > 0) {
        orbitGeometry = new THREE.CircleGeometry(setup.x, 5000);
        orbitGeometry.vertices[0] = orbitGeometry.vertices[orbitGeometry.vertices.length - 1];
        orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbit);
    }
}

// temp sun
var tempsun = new THREE.Mesh(new THREE.SphereGeometry(1, 10), new THREE.MeshBasicMaterial({color: 0xffff00}));
tempsun.position.set(0, 0, 0);
scene.add(tempsun);

// temp earth
var tempearth = new THREE.Mesh(new THREE.SphereGeometry(0.0092, 10), new THREE.MeshBasicMaterial({color: 0x00ffff}));
tempearth.position.set(215, 0, 0);
scene.add(tempearth);

var xAxis = new THREE.Vector3(1, 0, 0);
var yAxis = new THREE.Vector3(0, 1, 0);
var zAxis = new THREE.Vector3(0, 0, 1);

var stars = [];
var starColors = [ 
    0xffffff, // white
    0xffaf7f, // orange
    0xffff7f, // yellow
    0xff7f7f, // red
    0x7f7fff, // blue
];
var starGeometry = new THREE.SphereGeometry(6, 5, 5);
var starMaterial;

var dist;
var theta;
var phi;
var star;
for (var i = 0; i < 8000; i ++) {
    starMaterial = new THREE.MeshBasicMaterial({color: starColors[Math.floor(Math.random() * 5)]});

    dist = 16000;
    theta = Math.random() * Math.PI * 2;
    phi = Math.random() * Math.PI;

    star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(0, 0, dist);
    star.position.applyAxisAngle(xAxis, theta);
    star.position.applyAxisAngle(yAxis, phi);

    stars.push(star);
    //scene.add(star);
}

var cameraVector = camera.getWorldDirection(cameraVector);
function animate() {
    //for (var obj in 

    if (state == 'zoom') {
        zoomFrames ++;
        zoomCounter = Math.sin(zoomFrames * Math.PI / maxZoomFrames);

        zoomPosDifferential.subVectors(zoomPosEnd, zoomPosStart);
        zoomPosDifferential.multiplyScalar(zoomCounter * Math.PI / 2 / maxZoomFrames);
        zoomViewDifferential.subVectors(zoomViewEnd, zoomViewStart);
        zoomViewDifferential.multiplyScalar(zoomCounter * Math.PI / 2  / maxZoomFrames);
        
        camera.position.add(zoomPosDifferential);
        zoomViewCurr.add(zoomViewDifferential);

        controls.target = zoomViewCurr;

        camera.zoom += (zoomZoomEnd - zoomZoomStart) * zoomCounter * Math.PI / 2  / maxZoomFrames;
        camera.updateProjectionMatrix();

        if (zoomFrames >= maxZoomFrames) {
            zoomViewCurr.copy(zoomViewEnd);
            controls.target = zoomViewCurr;

            zoomFrames = 0;
            camera.zoom = zoomZoomEnd;

            camera.updateProjectionMatrix();

            var temp = zoomPosStart;
            zoomPosStart = zoomPosEnd;
            zoomPosEnd = temp;

            var temp = zoomViewStart;
            zoomViewStart = zoomViewEnd;
            zoomViewEnd = temp;

            var temp = zoomZoomStart;
            zoomZoomStart = zoomZoomEnd;
            zoomZoomEnd = temp;

            if (zoomIn) {
                state = 'zoom2';
            } else {
                zoomIn = !zoomIn;
            }
        }
    } else if (state == 'zoom2') {
        zoomFrames ++;

        zoomCounter = Math.sin(zoomFrames * Math.PI / (maxZoomFrames / 2));
        camera.zoom += (zoom2End - zoom2Start) * zoomCounter * Math.PI / maxZoomFrames;
        camera.updateProjectionMatrix();

        if (zoomFrames >= maxZoomFrames / 2) {
            zoomFrames = 0;

            var temp = zoom2End;
            zoom2End = zoom2Start;
            zoom2Start = temp;

            if (!zoomIn) {
                state = 'zoom';
            } else {
                zoomIn = !zoomIn;
            }
        }
    } else {
    }

    requestAnimationFrame( animate );
	controls.update();

    renderer.render( scene, camera );
}
animate();
