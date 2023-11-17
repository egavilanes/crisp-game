title="Fish!";

description=`  [Hold] to reel 
   up 
  [release] to go 
   down`;
characters=[
	`rrr
rrr`,
`
  l   
  l   
 l    
 l    
 l  l 
  ll  
`,
`
  bbb  
 bbblbb 
 bbbbbb
 bbbbbb
 bbbbbb 
`,
`
      
      
    yy
   yyy
    PP
    PP
`,
`
      
      
y     
yy   l
l   l 
P  l  
`,
`
   ppp
   ppp
   ppp
YYYYYY
YYYYYY
 YYYYY
`,
`
  l   
pl    
p     
YYYYY 
YYYYY 
YYYY  
`,
`
 bbbbbb
 bbbbbb
  bbb  
 bbbbb
 bbbbb
 b   b
`,
`
b
bb
 `
];
const g={x:100, y:150};

options={viewSize:{x:g.x,y:g.y},
isPlayingBgm:true,
theme:"crt",
isReplayEnabled:true,
seed:33};

let py;
let fy;

let MAX_SPEEDRATIO = 0.4;
let speedRatio;
let fishspeed;

const FDIR_COOLDOWN = 25;
let fDir_cooldown = 0;
let fDir = false;

let hold = 20;

let capturePercentage;
let captureText;

function drawText(text, position) {
    for (let i = 0; i < text.length; i++) {
      char(text[i], vec(position.x + i, position.y), { color: 'white' });
    }
  }

function update(){
    if(!ticks){
        speedRatio=0;
        fishspeed=0;
        fy=g.y*.45;
        py=g.y*.5;
       
        //player.pos.clamp(0,g.x,0,g.y);
       // fishbar.pos.clamp(0,g.x,0,g.y);
    }

	/*color('black');
	for (let i = py - 2; i--; i > g.y * 0.1) {
		rect(vec(g.x * 0.53, i), 1);
	}*/

	color('light_cyan');
	for (let i = 0; i < g.y * 0.1; i++) {
		for (let j = 0; j < g.x; j++) {
			rect(vec(j, i), 1);
		}
	}

	let drawIndex = 0;

	drawIndex = py - 2;
	while (drawIndex > g.y * 0.06) {
		drawIndex--;
		color('black');
		box(vec(g.x * 0.53, drawIndex), 1);
	}

	color('black');
	char('d', vec(g.x * 0.43, g.y * 0.05));
	char('e', vec(g.x * 0.49, g.y * 0.05));
	char('f', vec(g.x * 0.43, g.y * 0.09));
	char('g', vec(g.x * 0.49, g.y * 0.09));

    color('light_black');
	char("b", vec(g.x*.53,py));
    

	color('black');
	char("c", vec(g.x*.54,fy));
    char("h", vec(g.x*.54,fy+4));
    char("i", vec(g.x*.58,fy+1));

    
    if(input.isPressed)
    {
        if(input.isJustPressed){
            play('select');
            }
        speedRatio-=.07;

    }
    else{
            speedRatio+=.07;
    }

	py += Math.min(Math.max(speedRatio, -MAX_SPEEDRATIO), MAX_SPEEDRATIO);

    fishspeed+=rnd(-.02,.02);
    fy+=fishspeed;

    if(fDir)
    {
        fishspeed-=rnd(0,.02);
    } else
    {
        fishspeed+=rnd(0,.02);
    }

	if (fy >= g.y * 0.9) {
		fishspeed-=rnd(0,.02);
	}

    // Ensure the fish stays within the canvas bounds
    fy = clamp(fy, g.y * 0, g.y * 0.84);

	fDir_cooldown--;

	if (fDir_cooldown <= 0) {
		let rand = rnd(0, 1);
		if (rand < 0.5) {
			fDir = true;
		} else {
			fDir = false;
		}

		fDir_cooldown = FDIR_COOLDOWN;
	}

	if (py < fy - 10 || py > fy + 10) {
		hold-=.5;
        color('red');
	    char("b", vec(g.x*.53,py));
	} else{
        if(hold < 50) {
		    hold+=.5;
        }
        color('green');
	    char("b", vec(g.x*.53,py));
	}
    capturePercentage = clamp((hold / 20) * 100, 0, 100);
    if(hold < 0)
    {
        play('explosion');
        end();
    }

	if (fy < g.y * 0.1)  {
		play('powerUp');
        addScore(1, vec(g.x * 0.5, fy));
		
		speedRatio=0;
        fishspeed=0;
        fy=g.y*.45;
        py=g.y*.5;
		hold = 20;
	}
    captureText = `${capturePercentage.toFixed(0)}%`;
    for (let i = 0; i < captureText.length; i++) {
        char(captureText[i], vec(g.x * 0.5 - captureText.length + i * 8, g.y * 0.95));
    }

}