let balls = [], img, globalOn, dx, dy;
function Ball(x, y, r) {
	this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.ac = createVector(0, 0);
	this.on = true;
	this.r = r;

	this.draw = function () {
		circle(this.pos.x, this.pos.y, 2*this.r);
	}

    this.seek = function(tar, mx) {
        let desired = p5.Vector.sub(tar, this.pos);
        if (desired.mag() <= 100) desired.setMag(map(desired.mag(), 0, 100, 0, mx));
        else desired.setMag(mx);
        let seeking = p5.Vector.sub(desired, this.vel);
        this.ac.add(seeking);
    }

	this.update = function() {
        this.pos.add(this.vel);
        this.vel.add(this.ac);
        this.ac = createVector(0, 0);
		if (this.on) this.r += 1;
		if (this.x - this.r <= 0 ||
			this.y - this.r <= 0 ||
			this.x + this.r > width ||
			this.y + this.r) this.on = false;
        if (this.on) {
          for (let ball of balls) {
            if (ball == this) continue;
            if (Dist(this.pos, ball.pos) <= this.r + ball.r) {
              this.on = 0;
              break;
            }
          }
        } else if (!globalOn) {
          let mouse = createVector(mouseX-dx, mouseY-dy);
          if (Dist(this.pos, mouse) < 100) this.seek(mouse, -20);
          else this.seek(createVector(x, y), 5);
        }
	}
}

function Dist(a, b) {
    return dist(a.x, a.y, b.x, b.y);
}

function makeEm() {
	let cnt = 0;
	let ar = [];
	for (let i = 0; i < img.width; i++) {
		for (let j = 0; j < img.height; j++) {
		    if (brightness(img.get(i, j)) <= 55 && img.get(i, j)[3] > 0)
		    	ar.push({x: i, y: j});
		}
	}

	for (let i = 0; i < 3000; i++) {
      let ind = floor(ar.length*random());
      balls.push(new Ball(ar[ind].x, ar[ind].y, 0));
    }
}

function preload() {
	img = loadImage('manarat.png');
}
function setup() {
	let cnv = createCanvas(1000, 700);
	let canv = document.getElementById(cnv.id());
    canv.style.left = window.innerWidth/2 - width/2 + "px";
    dx = window.innerWidth/2 - width/2;
    canv.style.top = window.innerHeight/2 - height/2 + "px";
    dx = window.innerHeight/2 - height/2;

    document.getElementById("dv").style.height = window.innerHeight-100+"px";
    document.getElementById("dv").style.width = window.innerWidth+"px";
    makeEm();
}

function draw() {
	background(255);
    noStroke();
    translate((width-img.width)/2, (height-img.height)/2);
	// image(img, 0, 0);
    // fill(255, 220);
    // rect(0,0,width,height);
    fill(46,46,125);
  dx = (width-img.width)/2;
  dy = (height-img.height)/2;
	for (let ball of balls) {
		ball.update();
		ball.draw();
	}
    
  globalOn = false;
  for (let ball of balls) if (ball.on) globalOn = true;
}