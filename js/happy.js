window.onload = (function() {
    var WIDTH = 960, HEIGHT = 640;
    var PLAYER_X = WIDTH / 4;
    var PLAYER_W = 64;
    var PLAYER_H = 64;
    var points = 0;
    Crafty.init(WIDTH, HEIGHT);

    Crafty.sprite(32,"img/sprites.png", {
      player: [5,7],
      wall: [0,7]
     });

    Crafty.scene("loading", function() {
      Crafty.background("#000");
      Crafty.load(["img/sprites.png"], function() {
        Crafty.scene("title");
      });
    });

    Crafty.scene("title", function() {
      Crafty.background("#0F0");
      Crafty.e("Points, Canvas, 2D, Text")
	.attr({ x: 20, y: 20, w: 100, h: 20 })
        .text("HAPPY HELICOPTER")
	.textFont({ size: '40px' })
        .bind('KeyDown', restartGame);

      Crafty.e("Points, Canvas, 2D, Text, Mouse")
	.attr({ x: 20, y: 70, w: 100, h: 20 })
        .text("(Click here to start)")
	.textFont({ size: '40px' })
        .bind('Click', restartGame);

    });

    Crafty.scene("gameover", function() {
      Crafty.background("#F00");
      Crafty.e("Points, Canvas, 2D, Text")
	.attr({ x: 20, y: 20, w: 100, h: 20 })
        .text("GAME OVER: " + points + " Points. Press any key to restart")
	.textFont({ size: '40px', weight: 'bold' })
        .bind('KeyDown', restartGame);

      Crafty.e("Points, Canvas, 2D, Text, Mouse")
	.attr({ x: 20, y: 70, w: 100, h: 20 })
        .text("(Click here to restart)")
	.textFont({ size: '40px' })
        .bind('Click', restartGame);
    });

    function generateWalls() {
      var numberOfWalls = 4;
      var offset = 500;
      for (var i = 0; i < numberOfWalls; i++) {
        var openSpaceY = Crafty.math.randomInt(HEIGHT/16, HEIGHT/2);
        var openSpaceHeight = Crafty.math.randomInt(HEIGHT/4, HEIGHT/2);
	var x = offset + i * (WIDTH+64)/numberOfWalls;
	generateWall(x, 0, openSpaceY);
	generateWall(x, openSpaceY + openSpaceHeight, HEIGHT - (openSpaceY + openSpaceHeight));
      }
    }

    var scrollWall = function() {
      this.x -= 5;

      // TODO Break out
      if (this.x < (0 - this.w)) {
        this.x = WIDTH;
	this.passed = false;
      }

      // TODO Break out
      if (this.x < (PLAYER_X - PLAYER_W)  && !this.passed) {
        incrementPoints();
	this.passed = true;
      }
    };

    function incrementPoints() {
	points++;
        Crafty("Points").each(function () { 
	  this.text(points + " Points");
	});
    };

    var restartGame = function(e) {
      points = 0;
      Crafty.scene("main");
    }

    var endGame  = function() {
      Crafty.scene("gameover");
    };

    function generateWall(wX, wY, wH, speed) {
      Crafty.e("2D, Canvas, wall, Collision")
      	.attr({ x: wX, y: wY, w: 64, h: wH, passed: false })
        .bind('EnterFrame', scrollWall)
	.onHit("Player", endGame); 
    };


    var updatePlayer = function() {
          if (this.vy < 10) {
            this.vy += 1;
          }
          this.y += this.vy;
	  if (this.y < 0) {
            this.y = 0;
          }
          if (this.y > HEIGHT - 2 * this.h) {
            this.y = HEIGHT - 2 * this.h;
	  }

	  this.rotation = this.vy / 2;
    };

    var liftPlayer = function(e) {
        if(e.key == Crafty.keys.SPACE) {
          this.vy = -12;
        }
    };

    Crafty.scene("main", function() {
      generateWalls();
      Crafty.background("#DDDDDD");
      var pl = Crafty.e("Player, 2D, Canvas, player")
                  .attr({x: PLAYER_X, y: HEIGHT/3, w: PLAYER_W, h: PLAYER_H, rotation: 0, vy: 0})
		  .bind('EnterFrame', updatePlayer) 
                  .bind('KeyDown', liftPlayer);

      Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
        Crafty("Player").each(function () {
          this.vy = -12;
        });
      });

      Crafty.e("Points, Canvas, 2D, Text")
	.attr({ x: 20, y: 20, w: 100, h: 20 })
	.textFont({ size: '20px' })
        .text(points + " Points");
    });

    Crafty.scene("loading");
});

