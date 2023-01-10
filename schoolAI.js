let video, poseNet, pose = [], fff = 0;
function setup() {
    video = createCapture(VIDEO);
    cnv = createCanvas(640, 480);
    let canv = document.getElementById(cnv.id());
    canv.style.left = window.innerWidth/2 - width/2 + "px";
    dx = window.innerWidth/2 - width/2;
    canv.style.top = window.innerHeight/2 - height/2 + "px";
    dx = window.innerHeight/2 - height/2;

    document.getElementById("dv").style.height = window.innerHeight-100+"px";
    document.getElementById("dv").style.width = window.innerWidth+"px";
    
    video.hide();
    poseNet = ml5.poseNet(video, whenReady);
    poseNet.on('pose', gotEm);
}

function whenReady() {
    console.log("ready!");
}

function gotEm(Poses) {
    pose = [];
    if (Poses.length > 0) {
        for (let i = 0; i < Poses.length; i++) {
            // if (frameCount == 200) console.log(Poses[i]);
            if (Poses[i].pose.score > 0.25) pose.push(Poses[i].pose);
        }
    }
}

function half(a, b, t = 0.5) {
    return {x: a.x*t + b.x*(1-t), y: a.y*t+b.y*(1-t)};
}

function Dist(a, b) {
    return dist(a.x, a.y, b.x, b.y);
}

function Line(a, b) {
    line(a.x, a.y, b.x, b.y);
}

function draw() {
    push();
    background(0);
    translate(width,0);
    scale(-1, 1);
    if (fff) image(video, 0, 0);
    else background(0);

    if (pose.length > 0) {
        noFill();
        stroke(255);
        strokeWeight(5);
        for (let i = 0; i < pose.length; i++) {
            let p = pose[i];
            let sz = Dist(p.leftEar, p.rightEar);
            let cent = half(p.leftEar, p.rightEar);
            let neck = half(p.leftShoulder, p.rightShoulder);
            let zob = half(neck, half(p.leftHip, p.rightHip), 0.25);

            // Torso
            let lHip = half(p.leftHip, p.leftShoulder, 0.75);
            let rHip = half(p.rightHip, p.rightShoulder, 0.75);
            Line(lHip, rHip);
            Line(p.leftShoulder, p.rightShoulder);

            Line(p.leftShoulder, lHip);
            Line(p.rightShoulder, rHip);

            // Arms
            let rWrist = createVector(p.rightWrist.x, p.rightWrist.y);
            rWrist.x = (rWrist.x-p.rightElbow.x)*1.3 + p.rightElbow.x;
            rWrist.y = (rWrist.y-p.rightElbow.y)*1.3 + p.rightElbow.y;

            let lWrist = createVector(p.leftWrist.x, p.leftWrist.y);
            lWrist.x = (lWrist.x-p.leftElbow.x)*1.3 + p.leftElbow.x;
            lWrist.y = (lWrist.y-p.leftElbow.y)*1.3 + p.leftElbow.y;

            Line(p.leftShoulder, p.leftElbow);
            Line(p.rightShoulder, p.rightElbow);
            Line(p.rightElbow, rWrist);
            Line(p.leftElbow, lWrist);

            // Bottom
            Line(lHip, p.leftKnee);
            Line(rHip, p.rightKnee);
            Line(p.leftKnee, p.leftAnkle);
            Line(p.rightKnee, p.rightAnkle);

            ellipse(cent.x, cent.y, sz*1.5);
        }
    }

    pop();
}

function keyPressed() {fff ^= 1;}
