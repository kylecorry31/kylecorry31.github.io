var backgroundAnimation = new Ocean();
var bubbleCount;

function setup(){
  var canvas = createCanvas(document.body.clientWidth, document.body.clientHeight);
  canvas.id("p5-background");
  backgroundAnimation.setup();
}

function windowResized() {
  resizeCanvas(document.body.clientWidth, document.body.clientHeight);
}


function draw(){
  backgroundAnimation.draw();
}

function mouseClicked(){
  if(backgroundAnimation.mouseClicked){
    backgroundAnimation.mouseClicked();
  }
}

// ================= OCEAN =================
function Ocean(){
  var bubbles = [];

  function Bubble(){
    this.x = random() * width;
    this.y = random() * 2 * height;
    this.radius = random(10);
    this.noiseX = random(1000);


    this.update = function(){
      this.x += map(noise(this.noiseX), 0, 1, -0.001, 0.001) * width;
      this.x = constrain(this.x, -20, width + 20);

      this.y -= 1.5;
      if(this.y < 0){
        this.y = (1 + random()) * height;
        this.x = random() * width;
      }

      this.noiseX += 0.001;
    };

    this.draw = function(){
      noStroke();
      fill('rgba(255, 255, 255, 0.3)');
      ellipse(this.x, this.y, this.radius + 4 * (1 - this.y / height), this.radius + 4 * (1 - this.y / height));
    };
  }

  this.setup = function(){
    for (var i = 0; i < (bubbleCount == null ? 200 : bubbleCount); i++) {
      bubbles.push(new Bubble());
    }
  };

  this.draw = function(){
    clear();
    if (windowWidth > 600){
      bubbles.forEach(function(b){
        b.update();
        b.draw();
      });
    }
  };
}