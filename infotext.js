
var infoBoxState = 0;
var currentlyMoving = false;
var infoText = function(x, w) {
    if (infoBoxState === 0) {
        if (currentlyMoving === false) {
            infoTextUp(x, w);
            currentlyMoving = true;
        }
    }
    if (infoBoxState === 1) {
        if (currentlyMoving === false) {
            infoTextDown(x, w);
            currentlyMoving = true;
        }
    }
};
var infoTextUp = function(x, w) {
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
    infoBox.style.height = "150px";
    infoBox.style.opacity = "0";
    textBlock.style.opacity = "0";
    bulletPoints.style.opacity = "0";
    planetName.style.opacity = "0";
    textBlock.style.top = "900px";
    function step() {
        if (infoBox.style.top.substring(0, 3)<=705) {
            if (bulletPoints.style.top.substring(0, 3) >= 330) {
                bulletPoints.style.color = "rgba(200, 200, 200)";
                bulletPoints.style.top = bulletPoints.style.top.substring(0, 3) - 7 + "px";
            }
        }
        if (infoBox.style.top.substring(0, 3)<=1000) {
            if (planetName.style.top.substring(0, 3) >= 100) {
                planetName.style.top = planetName.style.top.substring(0, 3) - 7 + "px";
            }
        }
        if (textBlock.style.top.substring(0, 3) >= 455 && infoBox.style.top.substring(0, 3)<=575) {
            textBlock.style.color = "rgba(200, 200, 200, 255)";
            textBlock.style.top = String(parseInt(textBlock.style.top.substring(0, 3)) - 7) + "px";
        }
        if (infoBox.style.top.substring(0, 3) >= 130) {
            infoBox.style.top = infoBox.style.top.substring(0, 3) - 7 + "px";
        }
        if (infoBox.style.height.substring(0, 3) <= 700) {
            infoBox.style.height = String(parseInt(infoBox.style.height.substring(0, 3)) + 7) + "px";
        }
        if (infoBox.style.opacity < .9) {
            infoBox.style.opacity = String(parseFloat(infoBox.style.opacity)+0.009);
        }
        if (textBlock.style.opacity < 1) {
            textBlock.style.opacity = String(parseFloat(textBlock.style.opacity)+0.01);
        }
        if (bulletPoints.style.opacity < 1) {
            bulletPoints.style.opacity = String(parseFloat(bulletPoints.style.opacity)+0.01);
        }
        if (bulletPoints.style.top.substring(0, 3) <= 330) {
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
var infoTextDown = function(x, w) {
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
    planetName.style.top = "100px";
    bulletPoints.style.top = "330px";
    infoBox.style.top = "130px";
    infoBox.style.height = "700px";
    infoBox.style.opacity = ".9";
    textBlock.style.top = String(y+335)+"px";
    function step() {
        if (bulletPoints.style.top.substring(0, 3) <= 992) {
            bulletPoints.style.top = String(parseInt(bulletPoints.style.top.substring(0, 3)) + 7) + "px";
        }
        else {
            bulletPoints.style.color = "rgba(0, 0, 0, 0)";
        }
        if (infoBox.style.top.substring(0, 3)<=1000) {
            planetName.style.color = "rgba(200, 200, 200, 255)";
            if (planetName.style.top.substring(0, 3) <=992) {
                planetName.style.top = String(parseInt(planetName.style.top.substring(0, 3)) + 7) + "px";
            }
        }
        if (textBlock.style.top.substring(0, 3) <= 992) {
            textBlock.style.top = String(parseInt(textBlock.style.top.substring(0, 3)) + 7) + "px";
        }
        else {
            textBlock.style.color = "rgba(0, 0, 0, 0)";
        }
        
        if (infoBox.style.top.substring(0, 3) <=992) {
            infoBox.style.top = String(parseInt(infoBox.style.top.substring(0, 3)) + 7) + "px";
        }
        if (infoBox.style.top.substring >=300) {
            if (infoBox.style.height.substring(0, 3) >= 150) {
                infoBox.style.height = String(parseInt(infoBox.style.height.substring(0, 3)) - 7) + "px";
            }
        }
        if (infoBox.style.opacity > 0) {
            infoBox.style.opacity = String(parseFloat(infoBox.style.opacity)-0.009);
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
