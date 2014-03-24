window.onload = (function() {
    var WIDTH = 800, HEIGHT = 600;
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
      Crafty.e("2D, DOM, text").attr({w: 100, h: 20, x: 150, y: 120})
        .text("Loading")
        .css({"text-align": "center"});
    });

    function generateWalls() {
      var numberOfWalls = 6;
      var offset = 500;
      for (var i = 0; i < numberOfWalls; i++) {
        var openSpaceX = Crafty.math.randomInt(HEIGHT/16, HEIGHT/2);
        var openSpaceHeight = Crafty.math.randomInt(HEIGHT/4, HEIGHT/2);
	generateWall(offset + i * (WIDTH+64)/numberOfWalls, Crafty.math.randomInt(400,600), 200);
      }
    }

    function generateWall(wX, wY, wH, speed) {
      Crafty.e("2D, Canvas, wall, Collision")
      	.attr({ x: wX, y: wY, w: 64, h: wH })
        .bind('EnterFrame', function () {
          this.x -= 5;
          if (this.x < (0 - this.w)) {
	    this.x = WIDTH;
	    Crafty("Points").each(function () { 
	   	this.text(++this.points + " Points") });
	  }
	})
	.onHit("Player", function() {
	  Crafty("Points").each(function () { 
	         this.points = 0;
	         this.text(this.points + " Points") });

	});
    }

    Crafty.scene("main", function() {
      generateWalls();
      Crafty.background("#DDDDDD");
      var pl = Crafty.e("Player, 2D, Canvas, player, Fourway")
                  .attr({x: WIDTH/4, y: HEIGHT/2, w: 64, h: 64})
                  .multiway(14, { UP_ARROW: -90, DOWN_ARROW: 90 });
    
      Crafty.e("Points, Canvas, 2D, Text")
	.attr({ x: 20, y: 20, w: 100, h: 20, points: 0 })
        .text("0 Points");

     });

    Crafty.scene("loading");
});

