var parsepx = function(text) {
    for (var i = 0; i < text.length; i++) {
        if (text[i] === "p") {
            return i;
        }
    }
};

var infoBoxState = 0;
var currentlyMoving = false;
var infoText = function(x, w, y) {
    if (infoBoxState === 0) {
        if (currentlyMoving === false) {
            infoTextUp(x, w, y);
            currentlyMoving = true;
        }
    }
    if (infoBoxState === 1) {
        if (currentlyMoving === false) {
            infoTextDown(x, w, y);
            currentlyMoving = true;
        }
    }
};
var infoTextUp = function(x, w, y) {
    var textBlock = document.getElementById("infotext");
    var infoBox = document.getElementById("greybox");
    var planetName = document.getElementById("planetname");
    var bulletPoints = document.getElementById("bulletpoints");
    planetName.style.left = x+30;
    textBlock.style.left = x+30;
    bulletPoints.style.left = x+30;
    infoBox.style.left = x;
    planetName.style.width = w-50;
    textBlock.style.width = w-50;
    bulletPoints.style.width = w-50;
    infoBox.style.width = w;
    planetName.style.top = "870px";
    bulletPoints.style.top = "900px";
    infoBox.style.top = "900px";
    infoBox.style.height = "700px";
    infoBox.style.opacity = "0";
    textBlock.style.opacity = "0";
    bulletPoints.style.opacity = "0";
    planetName.style.opacity = "0";
    textBlock.style.top = "900px";
    function step() {
        if (infoBox.style.top.substring(0, parsepx(infoBox.style.top)) >= y) {
            infoBox.style.top = infoBox.style.top.substring(0, parsepx(infoBox.style.top)) - 7 + "px";
            textBlock.style.top = String(parseInt(infoBox.style.top.substring(0, parsepx(infoBox.style.top))) +350)+"px";
            bulletPoints.style.top = String(parseInt(infoBox.style.top.substring(0, parsepx(infoBox.style.top)))+200)+"px";
            planetName.style.top = String(parseInt(infoBox.style.top.substring(0, parsepx(infoBox.style.top)))-30)+"px";
        }
        if (infoBox.style.opacity < .5) {
            infoBox.style.opacity = String(parseFloat(infoBox.style.opacity)+0.005);
        }
        if (textBlock.style.opacity < 1) {
            textBlock.style.opacity = String(parseFloat(textBlock.style.opacity)+0.01);
        }
        if (bulletPoints.style.opacity < 1) {
            bulletPoints.style.opacity = String(parseFloat(bulletPoints.style.opacity)+0.01);
        }
        if (bulletPoints.style.top.substring(0, parsepx(bulletPoints.style.top)) <= y+200) {
            infoBoxState = 1;
            currentlyMoving = false;
            return;
        }
        if (planetName.style.opacity < 1) {
            planetName.style.opacity = String(parseFloat(planetName.style.opacity)+0.01);
        }
        window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
};
var infoTextDown = function(x, w, y) {
    var textBlock = document.getElementById("infotext");
    var infoBox = document.getElementById("greybox");
    var planetName = document.getElementById("planetname");
    var bulletPoints = document.getElementById("bulletpoints");
    planetName.style.left = x+30;
    textBlock.style.left = x+30;
    bulletPoints.style.left = x+30;
    infoBox.style.left = x;
    planetName.style.width = w-50;
    textBlock.style.width = w-50;
    bulletPoints.style.width = w-50;
    infoBox.style.width = w;
    planetName.style.top = String(y-30)+"px";
    bulletPoints.style.top = String(y+200)+"px";
    infoBox.style.top = y+"px";
    infoBox.style.height = "700px";
    infoBox.style.opacity = ".5";
    textBlock.style.top = String(y+335)+"px";
    function step() {
        
        if (infoBox.style.top.substring(0, parsepx(infoBox.style.top)) <=992) {
            infoBox.style.top = String(parseInt(infoBox.style.top.substring(0, parsepx(infoBox.style.top))) + 7) + "px";
            textBlock.style.top = String(parseInt(infoBox.style.top.substring(0, parsepx(infoBox.style.top))) +350)+"px";
            bulletPoints.style.top = String(parseInt(infoBox.style.top.substring(0, parsepx(infoBox.style.top)))+200)+"px";
            planetName.style.top = String(parseInt(infoBox.style.top.substring(0, parsepx(infoBox.style.top)))-30)+"px";
        }
        if (infoBox.style.top.substring(0, parsepx(infoBox.style.top)) >= 992) {
            infoBoxState = 0;
            currentlyMoving = false;
            return;
        }
        if (infoBox.style.opacity > 0) {
            infoBox.style.opacity = String(parseFloat(infoBox.style.opacity)-0.005);
        }
        if (textBlock.style.opacity > 0) {
            textBlock.style.opacity = String(parseFloat(textBlock.style.opacity)-0.01);
        }
        if (bulletPoints.style.opacity > 0) {
            bulletPoints.style.opacity = String(parseFloat(bulletPoints.style.opacity)-0.01);
        }
        if (planetName.style.opacity > 0) {
            planetName.style.opacity = String(parseFloat(planetName.style.opacity)-0.01);
        }
        if (planetName.style.top.substring(0, 3) >= 993) {
            infoBoxState = 0;
            currentlyMoving = false;
            return;
        }
        window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
};
