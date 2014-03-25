window.onload = (function() {
    var WIDTH = 900, HEIGHT = 600;
    Crafty.init(WIDTH, HEIGHT);

    Crafty.sprite(32,"img/sprites.png", {
      player: [5,7],
      wall: [0,7]
     });

    Crafty.scene("loading", function() {
      Crafty.load(["img/sprites.png"], function() {
        Crafty.scene("main");
      });

      Crafty.background("#000");
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
      if (this.x < (0 - this.w)) {
        this.x = WIDTH;
        Crafty("Points").each(function () { 
	  this.text(++this.points + " Points") });
	}
    };

    var resetPoints = function() {
      Crafty("Points").each(function () { 
        this.points = 0;
        this.text(this.points + " Points")
      });
    };

    function generateWall(wX, wY, wH, speed) {
      Crafty.e("2D, Canvas, wall, Collision")
      	.attr({ x: wX, y: wY, w: 64, h: wH })
        .bind('EnterFrame', scrollWall)
	.onHit("Player", resetPoints); 
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
                  .attr({x: WIDTH/4, y: HEIGHT/3, w: 64, h: 64, vy: 0})
		  .bind('EnterFrame', updatePlayer) 
                  .bind('KeyDown', liftPlayer);

      Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
        Crafty("Player").each(function () {
          this.vy = -12;
        });
      });

    
      Crafty.e("Points, Canvas, 2D, Text")
	.attr({ x: 20, y: 20, w: 100, h: 20, points: 0 })
        .text("0 Points");
     });

    Crafty.scene("loading");
});

