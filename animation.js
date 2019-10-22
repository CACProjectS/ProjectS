import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var state = 'title';
var viewPlanet;
const detectr = 8;

// Set up scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const origin = new THREE.Vector3(0, 0, 0);
const xAxis = new THREE.Vector3(1, 0, 0);
const yAxis = new THREE.Vector3(0, 1, 0);
const zAxis = new THREE.Vector3(0, 0, 1);


(function() {
    var dist = 5;
    var theta;
    var phi;
    var light;
    for (var i = 0; i < 30; i ++) {
        theta = Math.random() * Math.PI * 2;
        phi = Math.random() * Math.PI;

        var light = new THREE.PointLight(0xffffff, 0.2, 10000, 2);
        light.position.set(0, 0, dist);
        light.position.applyAxisAngle(xAxis, theta);
        light.position.applyAxisAngle(yAxis, phi);

        scene.add(light);
    }
})()

const whratio = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight, 0.002, 10000000);
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
var zoomPosStart;
var zoomPosEnd;
var zoomPosDifferential = new THREE.Vector3(0, 0, 0);
var zoomViewStart;
var zoomViewEnd;
var zoomViewCurr;
var zoomViewDifferential = new THREE.Vector3(0, 0, 0);

var solarSystem = [
    {
        name: 'Sun',
        diameter: 864938, // in miles
        diaText: 'Diameter - 864,938 miles',
        dist: 0, // in miles
        distText: 'Distance from center of Milky Way - 8 kiloparsecs (26092.48 light years)',
        orbit: 1, // in days
        orbitText: 'Galactical Orbit Time - ~250,000,000 earth years',
        rotation: 24.47, // in days
        rotationText: 'Rotation Time - 24.47 earth days',
        text: 'The Sun, whose wording comes from the Old and Middle English "sonne" / "sunne", is the center of our Solar System, and by far the closest star to Earth. There have been various depictions of the sun throughout ancient history, with some notable depictions being Ra, the sun god in Egyptian mythology, and Amaterasu, the sun god in Shintoism. The Sun is a yellow dwarf and is a type G star. Its heat is immense, with surface temperatures reaching 5,700 C, while the coronal temperature (gas above the surface) can reach up to 1,000,000 C. The Sun is composed of several layers: the corona, the chromosphere, the photosphere, the convection zone, the radiative zone, and the core. As for elemental composition, the Sun is made up of around 38.5% hydrogen, 60% helium, and 1.5% of various heavier elements. Sunlight also contains ultraviolet radiation, which heavily affects many aspects of life. As it houses Earth, it is the only star currently known to house life within its gravitational pull.'
    }, {
        name: 'Mercury',
        diameter: 3030,
        diaText: 'Diameter - 3,030 miles',
        dist: 32311302,
        distText: "Distance from Sun - 52.2 million km (32,311,302 miles)",
        orbit: 88,
        orbitText: 'Year length - 88 earth days',
        rotation: 59,
        rotationText: "Day length - 59 earth days",
        text: "Mercury, named after the messenger of the gods from Roman mythology, is the smallest and innermost planet in the solar system. It was one of the earliest planets to be discovered, with tablets from 1400 B.C. depicting it. Its atmosphere is extremely thin, resulting in a large amount of radiation and heat (reaching 427 C) on the side facing the Sun, while the other side remains cold (-173 C) and dark. Two satellites have been to Mercury, the first of which being Mariner 10 in 1974 and 1975, and the second of which being MESSENGER, which orbited Mercury over 4,000 times between 2004 and 2015. It is also heavily cratered, with 397 currently named and notable craters on it. Mercury is one of only two planets to have no natural satellites, meaning that it has no moons."
    }, {
        name: 'Venus',
        diameter: 7520,
        diaText: 'Diameter - 7,520 miles',
        dist: 64063370,
        distText: "Distance from Sun - 108.1 million km (64,063,370 miles)",
        orbit: 225,
        orbitText: 'Year length - 225 earth days',
        rotation: 243,
        rotationText: "Day length - 243 earth days",
        text: "Venus, named after the goddess of love and beauty from Roman mythology, is the hottest and second-innermost planet in the solar system. The planet is present in records of the oldest civilizations known. Its scorching heat, reaching upwards of 477 degrees Celsius, is a result of its thick atmosphere, which is made up of primarily carbon dioxide. A number of man-made probes have been to Venus, including the Venera series of probes, Mariner 2, Magellan, the Venus Express, and Akatsuki. Due to its similar size, mass, and distance to the sun, it is often referred to as Earth’s “sister planet”. Along with Mercury, Venus is one of the two planets to have no moons."
    }, {
        name: 'Earth',
        diameter: 7926,
        diaText: 'Diameter - 7,926 miles',
        dist: 91465840,
        distText: "Distance from Sun - 147.2 million km (91,465,840 miles)",
        orbit: 365,
        orbitText: 'Year length - 365 earth days',
        rotation: 1,
        rotationText: "Day length - 1 day",
        text: "Earth, named after the Latin word for ground, is the third closest planet to the sun, and the only planet currently known to host life. Earth is also the only planet to have naturally occurring liquid water, which is generally believed the be the main contributor to its abundant life. Temperatures on Earth vary from -94.7 C, at the South Pole, to over 43 C in valleys near the equator. Most dry air is generally composed of around 78% nitrogen, 21% oxygen, 1% argon, and .04% carbon dioxide. As of 2019, there are 4,987 satellites orbiting the planet, the most expensive and famous of which is the ISS, which is a collaborative project between a number of large nations including the U.S., Russia, the U.K., and China. Its only natural satellite is the Moon, which orbits at anywhere between 225,623 to 252,088 miles (363,105 - 405,696 kilometers) from Earth’s surface."
    }, {
        name: 'Mars',
        diameter: 4222,
        diaText: 'Diameter - 4,222 miles',
        dist: 135334646,
        distText: "Distance from Sun - 217.8 million km (135,334,646 miles)",
        orbit: 687,
        orbitText: 'Year length - 687 earth days',
        rotation: 1.027778,
        rotationText: "Day length - 1480 minutes (24 hours, 40 minutes)",
        text: "Mars, named after the Roman god of war, is the fourth closest planet to the sun, and the furthest terrestrial planet from the Sun. It is also the second-smallest planet, behind only Mercury. It is well-known for its reddish-brown color, which is a result of rusty (iron oxide) dust on its surface. Its atmosphere is made up of around 95% carbon dioxide, 3% nitrogen (molecular), and 2% argon. Temperatures on Mars, similarly to Earth, are largely varied, with temperatures as low as -143 C at the poles to temperatures as high as 35 C in equatorial summer. A large number of space missions have been sent to Mars, some of the more notable ones being Viking I in 1976, Opportunity in 2004, Curiosity in 2012, and InSight in 2018. There are already plans to begin a colony on Mars in the 2030s. Mars’ moons are Deimos and Phobos, both of which orbit fairly close to its surface."
    }, {
        name: 'Jupiter',
        diameter: 88846,
        diaText: 'Diameter - 88,846 miles',
        dist: 478890778,
        distText: "Distance from Sun - 770.7 million km (489,890,778 miles)",
        orbit: 4380,
        orbitText: 'Year length - 12 earth years',
        rotation: 0.416667,
        rotationText: "Day length - 10 hours",
        text: "Jupiter, named after the Roman god of the sky and thunder, is the largest and most massive planet in the solar system. It is the 5th furthest planet from the sun and the closest of the gas giants. Jupiter was discovered in pre-historic times and is present in astronomical records dating back thousands of years. Jupiter is made up of gas and has no surface. These gasses include around 75% hydrogen and 25% helium. Jupiter is a haven for storms, of which there are around 20 right now. Temperatures on Jupiter vary, but are generally around 300 C. Missions that have been sent into orbit around Jupiter are Galileo (1995-2003), and Juno (2016). Jupiter has 63 moons, four of which are the famous and renowned Galilean moons, which were discovered by Galileo Galilei in 1610."
    }, {
        name: 'Saturn',
        diameter: 37449,
        diaText: 'Diameter - 37,449 miles',
        dist: 886696691,
        distText: "Distance from Sun - 1.427 billion km (886,696,691 miles)",
        orbit: 10585,
        orbitText: 'Year length - 29 earth years',
        rotation: 0.44375,
        rotationText: "Day length - 639 minutes (10 hours, 39 minutes)",
        text: "Saturn, named after the Roman god of wealth and agriculture, is the second-largest and the only planet less dense than water. It is the 6th furthest planet from the Sun, and has the most spectacular and widely known rings. Saturn is one of five planets to be visible from the naked eye and has therefore been known since prehistoric times. Saturn’s elemental makeup is around 96.95% hydrogen, 3% helium, and 0.05% methane. Surface temperatures on Saturn generally fluctuate around -178 C. Spacecrafts that have been sent to orbit or fly by Saturn include Pioneer 11 (1979), Voyager 1 (1980), Voyager 2 (1981), and the more recent Cassini, which orbited Saturn from 2004 to 2017. Saturn has over 150 moons, the most famous of which is Titan, which is its largest moon."
    }, {
        name: 'Uranus',
        diameter: 31584,
        diaText: 'Diameter - 31,584 miles',
        dist: 1710013521,
        distText: "Distance from Sun - 2.752 billion km (1,710,013,521 miles)",
        orbit: 30660,
        orbitText: 'Year length - 84 earth years',
        rotation: 0.708333,
        rotationText: "Day length - 17 hours",
        text: "Uranus, named after the Greek god of the sky (who is also Saturn’s father in myth), is the second furthest planet away from the sun and has the highest axial tilt of any planet. As the closest planet not recognizable (though still visible) from the Earth, Uranus was not discovered until 1781, when Sir William Herschel discovered it via the telescope. It is known for its pale greenish-blue color, which is a result of its atmosphere, which is composed of hydrogen, helium, water, ammonia, methane, and other hydrocarbons. Uranus also has the coldest atmosphere of any planet in the Solar System, with temperatures reaching as low as -224 C (around 49 C away from absolute zero). The only space mission (other than aerial telescopes) to study Uranus has been Voyager 2, which came closest to Uranus on January 24, 1986. Voyager 2 showed that Uranus has 10 moons, and studied its ring system."
    }, {
        name: 'Neptune',
        diameter: 30598,
        diaText: 'Diameter - 30,598 miles',
        dist: 2814190130,
        distText: "Distance from Sun - 4.529 billion km (2,814,190,130 miles)",
        orbit: 60225,
        orbitText: 'Year length - 165 earth years',
        rotation: 0.666667,
        rotationText: "Day length - 16 hours",
        text: "Neptune, named after the Roman god of the sky, is the furthest planet from the sun, and also the planet with the highest density (mass divided by volume). Neptune is the only planet to not be visible with the naked eye, and was discovered via telescope by Johann Guile in 1846. Neptune’s atmosphere is composed of mainly hydrogen and helium (like the other gas giants), but similarly to Uranus, it also contains water, ammonia, and methane. Neptune is a deep blue color, which is caused by its unusually large proportion of methane in its atmosphere. The average atmospheric temperature of Neptune is around -200 C, which is the second coldest planet in the solar system. The only spacecraft to ever come near Neptune is Voyager 2, which had its closest encounter with Neptune on August 25, 1988. Neptune has 14 moons, which are named after Greek water deities (fittingly considering its parent planet)."
    },
];

var orbits = [];
var orbitColor = 0x007f3f;
(function() {
    var orbit;
    var setup;
    var orbitGeometry;
    var orbitMaterial = new THREE.LineBasicMaterial({color: orbitColor});
    for (var i in solarSystem) {
        setup = solarSystem[i];

        // Add the orbits
        if (setup.dist > 0) {
            orbitGeometry = new THREE.CircleGeometry(setup.dist / 389293, 5000);
            orbitGeometry.vertices[0] = orbitGeometry.vertices[orbitGeometry.vertices.length - 1];
            orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            orbit.visible = false;

            orbits.push(orbit);
            scene.add(orbit);
        }
    }
}) ()

var currPlanet = new THREE.Scene();
scene.add(currPlanet);

var indicator_geo = new THREE.SphereGeometry(50, 20, 20);
var indicator_green = new THREE.MeshBasicMaterial({ color: orbitColor });
var indicator_red = new THREE.MeshBasicMaterial({ color: 0xff0000 });

var loadingMax = solarSystem.length + 1;
var loadingCurr = 0;
function loaded() {
    return loadingCurr >= loadingMax;
}
(function() {
    let loader = new GLTFLoader();
    loader.load('./CAC Planets/Milky Way/scene.gltf', function(draw) {
        draw.scene.scale.multiplyScalar(100);

        draw.scene.rotation.x += Math.PI / 2;
        draw.scene.rotation.y += Math.PI / 2;
        draw.scene.rotation.z += Math.PI / 2;

        scene.add(draw.scene);
        loadingCurr ++;
    });
    loader.load('./CAC Planets/Sun/scene.gltf', function(draw){
        var sun = draw.scene.children[0];
        var scale = 0.09639;
        sun.scale.set(scale, scale, scale);

        sun.rotation.x += Math.PI / 2;
        sun.rotation.z += Math.PI / 2;

        solarSystem[0].model = draw.scene;

        scene.add(draw.scene);

        solarSystem[0].indicator = new THREE.Mesh(indicator_geo, indicator_green);
        solarSystem[0].indicator.position.copy(solarSystem[0].model.position);
        solarSystem[0].indicator.visible = false;
        scene.add(solarSystem[0].indicator);
        loadingCurr ++;
    });

    var planet;
    function makeModelFunc(count) {
        var planet = solarSystem[count];
        return function(draw) {
            draw.scene.position.set(planet.dist / 389293, 0, 0);

            var theta = Math.random() * Math.PI * 2;

            draw.scene.position.applyAxisAngle(zAxis, theta);

            var obj = draw.scene.children[0];
            var scale = 0.00000011187 * planet.diameter;
            obj.scale.set(scale, scale, scale);

            obj.rotation.x += Math.PI / 2;
            obj.rotation.z += Math.PI / 2;
            if (planet.name != 'Saturn') {
                obj.position.set(-scale * 0.915, -scale * 0.99, -scale * 0.9);
            }

            solarSystem[count].model = draw.scene;
            scene.add(draw.scene);

            // Add the indicator
            solarSystem[count].indicator = new THREE.Mesh(indicator_geo, indicator_green);
            solarSystem[count].indicator.position.copy(solarSystem[count].model.position);
            solarSystem[count].indicator.visible = false;
            scene.add(solarSystem[count].indicator);

            loadingCurr ++;
        }
    }
    for (var i = 1; i < solarSystem.length; i ++) {
        planet = solarSystem[i];
        loader.load('./CAC Planets/' + planet.name + '/scene.gltf', makeModelFunc(i));
    }
}) ();


var cameraVector = camera.getWorldDirection(cameraVector);

function startZoom(planet) {
    zoomPosStart = camera.position.clone();
    zoomPosEnd = planet.model.position.clone();
    zoomViewStart = origin.clone();
    zoomViewEnd = planet.model.position.clone();
    zoomViewCurr = origin.clone();

    document.getElementById('planetname').innerHTML = planet.name;

    var bullets = ['dia', 'dist', 'orbit', 'rotation'];
    document.getElementById('bulletpoints').innerHTML = '';
    for (var i = 0; i < bullets.length; i ++) {
        document.getElementById('bulletpoints').innerHTML += '• ' + planet[bullets[i] + 'Text'] + '<br>';
    }

    document.getElementById('infotext').innerHTML = planet.text;

    infoText(650, 700, 10);

    state = 'zoomIn';
}
function toScreenPosition(obj, camera) {
    var vector = new THREE.Vector3();

    var widthHalf = 0.5*renderer.getContext().canvas.width;
    var heightHalf = 0.5*renderer.getContext().canvas.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };

};
function dist2d(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};
function mouseDist(x, y) {
    return dist2d(event.clientX, event.clientY, x, y);
}

document.addEventListener('click', function() {
    if (state == 'title') {
        titleScreenVars.titleState = 'up';
    } else if (loaded() && state == 'view') {
        var planet;
        var pos;
        for (var i = 0; i < solarSystem.length; i ++) {
            planet = solarSystem[i];
            pos = toScreenPosition(planet.model, camera);
            if (mouseDist(pos.x, pos.y) < detectr) {
                planet.model.visible = true;
                startZoom(planet);

                viewPlanet = i;
                indicatorStatus = false;

                document.getElementById('indicatorbutton').style.display = 'none';
                break;
            }
        }
    }
});
document.addEventListener('mousemove', function() {
    if (loaded() && state == 'view') {
        var planet;
        var pos;
        for (var i = 0; i < solarSystem.length; i ++) {
            planet = solarSystem[i];
            pos = toScreenPosition(planet.model, camera);
            if (mouseDist(pos.x, pos.y) > detectr) {
                planet.indicator.material = indicator_green;
            } else {
                planet.indicator.material = indicator_red;
                for (var j = i + 1; j < solarSystem.length; j ++) {
                    solarSystem[j].indicator.material = indicator_green;
                }
                break;
            }
        }
    }
});

function indicatorsOff() {
    for (var i = 0; i < solarSystem.length; i ++) {
        solarSystem[i].indicator.visible = false;
    }
}
function indicatorsOn() {
    for (var i = 0; i < solarSystem.length; i ++) {
        solarSystem[i].indicator.visible = true;
    }
}

function orbitsOff() {
    for (var i = 0; i < orbits.length; i ++) {
        orbits[i].visible = false;
    }
}
function orbitsOn() {
    for (var i = 0; i < orbits.length; i ++) {
        orbits[i].visible = true;
    }
}

function bellCurve(curr, max) {
    var map = (curr / max) * 9 - 4;
    return Math.exp(-map * map) / Math.sqrt(Math.PI);
}
function camDist() {
    var diff = camera.position.clone().sub(controls.target);
    return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2) + Math.pow(diff.z, 2));
};

const timeMultiplier = 0.1;
var titleScreenVars = {
    titleState: '',
    titleIncRate: 1.5,
};
var parsepx = function(text) {
    for (var i = 0; i < text.length; i++) {
        if (text[i] === "p") {
            return i;
        }
    }
};
function animate() {
    if (state == 'title') {
        var titlePage = document.getElementById("titleScreen");
        titlePage.style.width = window.innerWidth+"px";
        titlePage.style.height = String(window.innerHeight+1)+"px";
        titlePage.style.top = "0px";
        var logoImage = document.getElementById("logo");
        logoImage.style.height = String(window.innerHeight/3)+"px";
        logoImage.style.width = String(window.innerWidth/3)+"px";
        logoImage.style.top = String((window.innerHeight/2)-parseInt(logoImage.style.height.substring(0, parsepx(logoImage.style.height))/2)-100)+"px";
        logoImage.style.left = String((window.innerWidth/2)-parseInt(logoImage.style.width.substring(0, parsepx(logoImage.style.width))/2))+"px";
        var logoText = document.getElementById("titlescreentext");
        logoText.style.fontSize = innerWidth/10 + "px";
        //logoText.style.top = String((window.innerHeight/2))+"px";
        logoText.style.top = String(parseInt(logoImage.style.top.substring(0, parsepx(logoImage.style.top)))+260)+"px";
        if (titleScreenVars.titleState === 'up') {
            titlePage.style.top = String(parseInt(titlePage.style.top.substring(0, parsepx(titlePage.style.top))) - titleScreenVars.titleIncRate)+"px";
            logoImage.style.top = String(parseInt(logoImage.style.top.substring(0, parsepx(logoImage.style.top))) - titleScreenVars.titleIncRate)+"px";
            logoText.style.top = String(parseInt(logoImage.style.top.substring(0, parsepx(logoImage.style.top)))+260)+"px";
            titleScreenVars.titleIncRate *= 1.1;
        }
        if (titleScreenVars.titleIncRate > 1500) {
            state = 'view';
        }
    } else if (loaded()) {
        if (state == 'view') {
            controls.enableZoom = false;
            for (var i = 0; i < solarSystem.length; i ++) {
                solarSystem[i].model.position.applyAxisAngle(zAxis, timeMultiplier/solarSystem[i].orbit);
                solarSystem[i].indicator.position.applyAxisAngle(zAxis, timeMultiplier/solarSystem[i].orbit);
            }
        } else if (state == 'zoomIn') {
            controls.enableRotate = false;
            zoomFrames ++;
            zoomCounter = bellCurve(zoomFrames, maxZoomFrames);

            zoomPosDifferential.subVectors(zoomPosEnd, zoomPosStart);
            zoomPosDifferential.multiplyScalar(zoomCounter * 9 / maxZoomFrames * (viewPlanet == 0 ? 0.9995 : 0.999995));
            zoomViewDifferential.subVectors(zoomViewEnd, zoomViewStart);
            zoomViewDifferential.multiplyScalar(zoomCounter * 9 / maxZoomFrames);
            
            camera.position.add(zoomPosDifferential);
            zoomViewCurr.add(zoomViewDifferential);

            controls.target = zoomViewCurr;

            if (zoomFrames >= maxZoomFrames) {
                controls.target.copy(zoomViewEnd);

                zoomFrames = 0;
                controls.enableRotate = true;
                controls.enableZoom = true;

                state = 'viewPlanet';

                document.getElementById('infotoggle').style.display = 'block';
                document.getElementById('backbutton').style.display = 'block';
            }
        } else if (state == 'zoomOut') {
            controls.enableRotate = false;
            zoomFrames ++;
            zoomCounter = bellCurve(zoomFrames, maxZoomFrames);

            zoomPosDifferential.subVectors(zoomPosEnd, zoomPosStart);
            zoomPosDifferential.multiplyScalar(zoomCounter * 9 / maxZoomFrames);
            zoomViewDifferential.subVectors(zoomViewEnd, zoomViewStart);
            zoomViewDifferential.multiplyScalar(zoomCounter * 9 / maxZoomFrames);
            
            camera.position.add(zoomPosDifferential);
            zoomViewCurr.add(zoomViewDifferential);

            controls.target = zoomViewCurr;

            if (zoomFrames >= maxZoomFrames) {
                camera.position.copy(zoomPosEnd);
                controls.target.copy(zoomViewEnd);

                zoomFrames = 0;
                controls.enableRotate = true;

                document.getElementById('indicatorbutton').style.display = 'block';
                indicatorStatus = true;

                if (solarSystem[viewPlanet].name != 'Sun') {
                    solarSystem[viewPlanet].model.visible = false;
                }
                state = 'view';
            }
        } else if (state == 'viewPlanet' && back) {
            back = false;

            state = 'zoomOut';
            document.getElementById('infotoggle').style.display = 'none';
            document.getElementById('backbutton').style.display = 'none';

            zoomPosStart = camera.position.clone();
            zoomPosEnd = cameraStart.clone();
            zoomViewStart = controls.target.clone();
            zoomViewEnd = origin.clone();
            zoomViewCurr = controls.target.clone();

            if (infoBoxState == 1) {
                infoText(650, 700, 10);
            }
        }

        if (state != 'view') {
            solarSystem[viewPlanet].model.rotation.z += timeMultiplier/solarSystem[viewPlanet].rotation;
        }

        if (indicatorStatus) {
            indicatorsOn();
        } else {
            indicatorsOff();
        }

        if (orbitStatus) {
            orbitsOn();
        } else {
            orbitsOff();
        }
    }
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
	controls.update();

    //document.getElementById('scaleText').innerHTML = '≈' + (camDist() * innerWidth * 0.001205 * 389293).toString().substring(0, 10) + ' miles';
}
animate();
