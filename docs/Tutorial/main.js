var timeout;
var directionX = "";
var directionY = "";
document.onmousemove = function(){
  clearTimeout(timeout);
  timeout = setTimeout(function(){directionX = "still"; directionY = "still";}, 100);
}

var oldX = 0,
    oldY = 0,
mousemovemethod = function (e) {
    
  if (e.pageY < oldY - 2) {
    directionY = "up"
  } else if (e.pageY > oldY + 2) {
    directionY = "down"
  }
  if (e.pageX < oldX - 1) {
    directionX = "left"
  } else if (e.pageX > oldX + 1) {
    directionX = "right"
  }
        
  oldX = e.pageX;
  oldY = e.pageY;
        
}
document.addEventListener('mousemove', mousemovemethod);


title = "Archery?";

description = `
     Move with mouse
    [Click the mouse] 
    when the white box
     hits the target
`;

characters = [
`
  rr
 rccr
rcrrcr
rcrrcr
 rccr
  rr
`,
`
      
      
  ll  
  ll


`
];

const G = {
  WIDTH: 200,
  HEIGHT: 100,
  REMAINING: 20,
  SPEED: 1
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  seed: 2,
  isPlayingBgm: true,
  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2,
  theme: "simple"
};
/**
 * @typedef {{
 * pos: Vector,
 * }} Star
 */
/**
 * @type  { Star [] }
 */
let stars;

/**
 * @typedef {{
 * pos: Vector,
 * }} Player
 */
/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} Target
 */
/**
 * @type { Target [] }
 */
let targets;

/**
 * @typedef {{
 * pos: Vector,
 * }} Crosshair
 */
/**
 * @type { Crosshair }
 */
let crosshair;

let targetScore = 1000;

function update() {
  if (!ticks) {
    stars = times(20, () => {
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);

      return {
        // Creates a Vector
        pos: vec(posX, posY),
      };
    });
    // Player Initalization
    player = {
      pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5)
    };
    crosshair = {
      pos: vec(G.WIDTH * 0.5 - 2, G.HEIGHT * 0.5)
    };

    targets = [];
  }
  //text("hello", G.WIDTH/2, G.HEIGHT/2);
  color("black");
  char("b", crosshair.pos);
  //color("blue");
  //box(player.pos, 1);
  player.pos = vec(input.pos.x, input.pos.y);
  player.pos.clamp(G.WIDTH/2 - 8, G.WIDTH/2 + 5, G.HEIGHT/2 - 6, G.HEIGHT/2 + 8);

  // Spawning Targets
  if (targets.length === 0) {
    const posX = rnd(0, G.WIDTH);
    const posY = rnd(G.HEIGHT/10, G.HEIGHT);
    targets.push({ 
      pos: vec(posX, posY)
    });
  }

  //color("black");
  //char("a", target.pos);
  if (targetScore > 50) {
    targetScore -= 1;
  }

  // Spawning Stars
  stars.forEach((s) => {
 
    if (player.pos.y == G.HEIGHT/2 - 6) {
      s.pos.y += G.SPEED / 1.5;
    }
    if (player.pos.y == G.HEIGHT/2 + 8) {
      s.pos.y -= G.SPEED / 1.5;
    }
    if (player.pos.x == G.WIDTH/2 - 8) {
      s.pos.x += G.SPEED;
    }
    if (player.pos.x == G.WIDTH/2 + 5) {
      s.pos.x -= G.SPEED;
    }
    // Bring the star back to top once it's past the bottom of the screen
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    // Choose a color to draw
    color("green");
    // Draw the star as a square of size 1
    box(s.pos, 2, 3);
  });

  remove(targets, (t) => {
    color("black");
    char("a", t.pos);
    color("red");
    box(player.pos, 4);
    const speedX = 0.25; // Adjust the speed as needed
    const rangeX = G.WIDTH / 2; // Adjust the range as needed
    
    // Move the target side to side using a sine function
    t.pos.x += speedX * Math.sin(ticks * 0.15);

    if (input.isJustPressed) {
      if (char("b", G.WIDTH * 0.5 - 2, G.HEIGHT * 0.5).isColliding.char.a) {
        color("blue");
        particle(t.pos);
        color("black");
        particle(t.pos);
        play("hit");
        play("coin");
        G.REMAINING--;
        addScore(targetScore);
        targetScore = 1000;
        //return(isCollidingWithCrosshair);
        return (true);
      } 
      else {
        play("select");
        if (targetScore > 50) {
          targetScore -= 50;
        }
      }
    }
    // G.WIDTH/2 - 8, G.WIDTH/2 + 5, G.HEIGHT/2 - 6, G.HEIGHT/2 + 8
    if (player.pos.y == G.HEIGHT/2 - 6) {
      t.pos.y += G.SPEED / 1.5 ;
    }
    if (player.pos.y == G.HEIGHT/2 + 8) {
      t.pos.y -= G.SPEED / 1.5;
    }
    if (player.pos.x == G.WIDTH/2 - 8) {
      t.pos.x += G.SPEED;
    }
    if (player.pos.x == G.WIDTH/2 + 5) {
      t.pos.x -= G.SPEED;
    }


    t.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
    
  });

  color("green");
  text(G.REMAINING.toString(), 3, 10);
  if (G.REMAINING == 0 ) {
    end();
    G.REMAINING = 20;
  }
}