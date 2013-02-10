/** 
 * Shim layer, polyfill, for requestAnimationFrame with setTimeout fallback.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */ 
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
 
 
/**
 * Shim layer, polyfill, for cancelAnimationFrame with setTimeout fallback.
 */
window.cancelRequestAnimFrame = (function(){
  return  window.cancelRequestAnimationFrame || 
          window.webkitCancelRequestAnimationFrame || 
          window.mozCancelRequestAnimationFrame    || 
          window.oCancelRequestAnimationFrame      || 
          window.msCancelRequestAnimationFrame     || 
          window.clearTimeout;
})();

window.Key = {
	pressed: {},
	DOWN: 40, 
	isDown: function(keyCode, keyCode1) {
		return this.pressed[keyCode] || this.pressed[keyCode1];
	},
	onKeydown: function(event) {
		if(event.keyCode == 40) {
			event.preventDefault();
		}
		this.pressed[event.keyCode] = true;
	},
	onKeyup: function(event) {
		delete this.pressed[event.keyCode];
	}
};
window.addEventListener('keyup', function(event) {Key.onKeyup(event);}, false);
window.addEventListener('keydown', function(event) {Key.onKeydown(event);},  false);


window.onkeydown = function(event) {
	var key = event.key || event.which;
	
	switch(key) {
    case 37: shape.moveLeft(); break;                      	// left
    case 39: shape.moveRight(); break;                   	// right
	//case 40: shape.fall(); event.preventDefault(); break;
    case 38: shape.rotate(); event.preventDefault(); break;  						// up
    default: break;
	};        
	//console.log('Keypress: ' + event + ' key: ' + key);
};

function Map(gridsize, vertical, horizontal, ct) {
	this.gridsize 	= gridsize 		|| 30;
	this.vertical 	= vertical 		|| 12;
	this.horizontal = horizontal 	|| 20;
	this.gridMap	= [];
	this.ct 		= ct;
	for(var w = 0; w < this.horizontal; w++){
		this.gridMap[w] = [];
		for(var h = 0; h < this.vertical; h++) {
			this.gridMap[w][h] = 0;
		}
	}
}
Map.prototype.draw = function() {
	this.ct.fillStyle = '#666';
	this.ct.strokeStyle = '#000';
	this.ct.lineWidth = 1;
	for(var w = 0; w < this.horizontal; w++) {
		for(var h = 0; h < this.vertical; h++) {
			if (this.gridMap[w][h] == 0) {
				this.ct.fillRect(w*(this.gridsize), h*(this.gridsize), this.gridsize, this.gridsize);
			}
		}
	}
}
Map.prototype.grid = function() {
	return this.gridMap;
}
function Shape(shapeId, rotation, gridMap) {
	this.x = 5;
	this.y = 0;
	this.shapeId = shapeId || 0;
	this.rotation = rotation || 0;
	this.fill = ['#666', '#FF0', '#0A0', '#C00', '#00B', '#0FF', '#F0F', '#F52'];
	this.gridMap = gridMap;
	this.I = 	[[[1,0,0,0], [1,0,0,0], [1,0,0,0], [1,0,0,0]],
				[[1,1,1,1], [0,0,0,0], [0,0,0,0], [0,0,0,0]],
				[[1,0,0,0], [1,0,0,0], [1,0,0,0], [1,0,0,0]],
				[[1,1,1,1], [0,0,0,0], [0,0,0,0], [0,0,0,0]]];
	this.L = 	[[[0,0,1,0],[0,0,1,0],[0,1,1,0],[0,0,0,0]],
				[[1,1,1,0], [0,0,1,0], [0,0,0,0], [0,0,0,0]],
				[[1,1,0,0], [1,0,0,0], [1,0,0,0], [0,0,0,0]],
				[[0,0,0,0], [1,0,0,0], [1,1,1,0], [0,0,0,0]]];
	this.RL = 	[[[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]],
				[[1,1,1,0], [1,0,0,0], [0,0,0,0], [0,0,0,0]],
				[[1,0,0,0], [1,0,0,0], [1,1,0,0], [0,0,0,0]],
				[[0,0,0,0], [0,0,1,0], [1,1,1,0], [0,0,0,0]]];
	this.T = 	[[[1,1,1,0], [0,1,0,0], [0,0,0,0], [0,0,0,0]],
				[[1,0,0,0], [1,1,0,0], [1,0,0,0], [0,0,0,0]],
				[[0,0,0,0], [0,1,0,0], [1,1,1,0], [0,0,0,0]],
				[[0,0,1,0], [0,1,1,0], [0,0,1,0], [0,0,0,0]]];
	this.Z = 	[[[1,0,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]],
				[[0,1,1,0], [1,1,0,0], [0,0,0,0], [0,0,0,0]],
				[[1,0,0,0], [1,1,0,0], [0,1,0,0], [0,0,0,0]],
				[[0,1,1,0], [1,1,0,0], [0,0,0,0], [0,0,0,0]]];
	this.RZ = 	[[[0,0,1,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
				[[1,1,0,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
				[[0,0,1,0], [0,1,1,0], [0,1,0,0], [0,0,0,0]],
				[[1,1,0,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]]];
	this.box = 	[[[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
				[[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
				[[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]],
				[[0,1,1,0], [0,1,1,0], [0,0,0,0], [0,0,0,0]]];
	this.shapeArray = [0, this.I, this.L, this.RL, this.T, this.Z, this.RZ, this.box];
}
Shape.prototype.draw = function(ct, gridsize) {
	for(var w=0; w<4; w++) {
		for(var h=0; h < 4; h++) {
			if(this.shapeArray[this.shapeId][this.rotation][w][h] == 1) {
				ct.fillStyle = this.fill[this.shapeId];
				ct.fillRect((this.x+w)*gridsize,(this.y+h)*gridsize, gridsize, gridsize);
			}
		}
	}
}
Shape.prototype.fall = function(ct,	 points, scoreboard, score, level) {
	this.y++;
	var next = false;
	for (var w = 0; w<4; w++) {
		for (var h = 0; h<4; h++) {
			if(this.shapeArray[this.shapeId][this.rotation][w][h] == 1 
			&& (this.gridMap[this.x+w][this.y+h] > 0 || this.y+h > this.gridMap[0].length-1)) {
				this.y--;
				if(this.y > 0) {
					next = true;
				}
				else {
					for(var gw = 0; gw < 12; gw++) {
						for(var gh = 0; gh < 20; gh++) {
							this.gridMap[gw][gh] = 0;
						}
					}
					score = 0;
					level = 0;
					scoreboard.innerHTML = '<h1>Score ' + score + ' </br>Level ' + level + ' </h1>';
				}
			}
		}
	}
	if (next) {
		// Lås fast current piece
		this.lock(ct);
		//kolla rader
		this.rowcheck(ct, points, scoreboard, score, level);
		// Skapa next piece
		this.x = 5;
		this.y = -1;
		this.shapeId = Math.floor(1 +  Math.random() * 7 );
		this.rotation = Math.floor( Math.random() * 4 );
	}
}
Shape.prototype.lock = function(ct) {
	for (var w = 0; w<4; w++) {
		for (var h = 0; h<4; h++) {
			if(this.shapeArray[this.shapeId][this.rotation][w][h] == 1) {
				this.gridMap[this.x+w][this.y+h] = this.shapeId;
				ct.fillStyle = this.fill[this.shapeId];
				ct.fillRect((this.x+w)*gridsize,(this.y+h)*gridsize, gridsize, gridsize);
			}
		}
	}
}
Shape.prototype.rowcheck = function(ct, points) {
	for(var h = 0; h < 20; h++) {
		var wholeRow = true;
		for(var w = 0; w < 12; w++) {
			if(this.gridMap[w][h] == 0) {
				wholeRow = false;
			}
		}
		if (wholeRow) {
			for(var r = h; r > 0; r--) {
				for(w = 0; w < 12; w++) {
					this.gridMap[w][r] = this.gridMap[w][r - 1];
					if (this.gridMap[w][r] > 0) {
						ct.fillStyle = this.fill[this.gridMap[w][r]];
						ct.fillRect((w)*gridsize,(r)*gridsize, gridsize, gridsize);
					}
				}
			}
			points.update(scoreboard, score, level);
		}
	}
}
Shape.prototype.rotate = function() {	
	this.rotation++;
	this.rotation = this.rotation % 4;
	for(var w = 0; w < 4; w++) {
		for(var h = 0; h < 4; h++) {
			if(this.shapeArray[this.shapeId][this.rotation][w][h] == 1) {
				if(this.x+w < 0) {
					console.log('moveright rotation');
					this.moveLeft();
				}
				if(this.x+w > 11) {	
					console.log('moveleft rotation');
					this.moveRight();
				}
				if(this.x+w >= 0 && this.x+w <= 11 && this.gridMap[this.x+w][this.y+h] > 0) {
					this.rotation--;
					if(this.rotation == -1) {
						this.rotation = 3;
					}
				}
			}
		}
	}
	this.rotation = this.rotation % 4;
	console.log(this.rotation);
}
Shape.prototype.moveLeft = function() {
	this.x--;
	for(var w = 0; w < 4; w++) {
		for(var h = 0; h < 4; h++) {
			if(this.shapeArray[this.shapeId][this.rotation][w][h] == 1) {
				if(this.x+w < 0) {
					while(this.x+w < 0) {
						this.x++;
					}
				}
				if(this.gridMap[this.x+w][this.y+h] > 0){
					this.x++;
				}
			}
		}
	}
}
Shape.prototype.moveRight = function() {	
	this.x++;
	for(var w = 0; w < 4; w++) {
		for(var h = 0; h < 4; h++) {
			if(this.shapeArray[this.shapeId][this.rotation][w][h] == 1) {
				if(this.x+w > 11) {
					while(this.x+w > 11) {
						this.x--;
					}
				}
				if(this.gridMap[this.x+w][this.y+h] > 0){
					this.x--;
				}
			}
		}
	}
	
}
Shape.prototype.update = function(ct, points, scoreboard, score, level) {
	if (Key.isDown(Key.DOWN)) this.fall(ct, points, scoreboard, score, level);
}
function lines(ct, gridsize, horizontal, vertical) {
	this.gridsize 	= gridsize 		|| 30;
	this.vertical 	= vertical 		|| 12;
	this.horizontal = horizontal 	|| 20;

	for(var i = 0; i < this.horizontal+1; i++){
		ct.beginPath();
		ct.moveTo(i*(this.gridsize), 0);
		ct.lineTo(i*(this.gridsize), this.vertical*this.gridsize);
		ct.stroke();
	}
	for(var i = 0; i < this.vertical+1; i++){
		ct.beginPath();
		ct.moveTo(0, i*(this.gridsize));
		ct.lineTo(this.horizontal*this.gridsize, i*(this.gridsize));
		ct.stroke();
	}
}

function gameScore(scoreboard, score, level) {
	this.scoreboard = scoreboard || document.getElementById('score');
	this.score = score || 0;
	this.level = level || 0;
	scoreboard.innerHTML = '<h1>Score ' + this.score + ' </br>Level ' + this.level + ' </h1>';
}
gameScore.prototype.update = function(scoreboard, score, level) {
	var prepoints = this.score;
	this.score += 10;
	if(prepoints < this.score) {
		if(this.score > 90) {
			if(prepoints%100 == 60 || prepoints%100 == 70 || prepoints%100 == 80 || prepoints%100 == 90) {
				if(this.score%100 == 0 || this.score%100 == 10 || this.score%100 == 20 || this.score%100 == 30) {
					if(this.level < 10) {
						this.level++;
						speed -= 0.040;
					}
				}
			}
		}
	}
	scoreboard.innerHTML = '<h1>Score ' + this.score + ' </br>Level ' + this.level + ' </h1>';
}

window.Game = (function(canvas) {
	var canvas, ct, map, player, lastGameTick, td;
	
	var init = function(canvas) {
		canvas = document.getElementById(canvas);
		ct = canvas.getContext('2d');
		scoreboard = document.getElementById('scoreboard');
		gridsize = 30,
		vertical = 20,
		horizontal = 12,
		width = vertical * gridsize,
		height = horizontal * gridsize,
		td = 0;
		speed = 0.500;
		score = 0;
		level = 0;
		map = new Map(gridsize, vertical, horizontal, ct);
		shape = new Shape(Math.floor(1 + Math.random() * 7), Math.floor( Math.random() * 4), map.grid());
		points = new gameScore(scoreboard, score, level);
	};
	var movePiece = function() {
		shape.update(ct, points, scoreboard, score, level);
	}
	var tick = function() {
		shape.fall(ct, points, scoreboard, score, level);
	}
	var update = function() {
		map.draw();
		lines(ct, gridsize, horizontal, vertical);
	};
	var render = function() {
		shape.draw(ct, gridsize);
		lines(ct, gridsize, horizontal, vertical);
	};
	var animLoop = function() {
		var now = Date.now();
		td += (now - (lastGameTick || now)) / 1000; // Timediff since last frame / gametick
		lastGameTick = Date.now();
		requestAnimFrame(animLoop);
		update();
		render();		
		movePiece();
		if(td > speed) {
			tick();
			td = 0;
		}
	
	};
	return {
		'init': init,
		'animLoop': animLoop
	}

}) ();

$(document).ready(function(){
	'use strict';
	Game.init('canvas1');
	Game.animLoop();
	
	console.log('lets play');
  
});