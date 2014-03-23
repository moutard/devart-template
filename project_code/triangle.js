(function() {

    // Init som useful stuff for easier access (don't need 'em all)
    var   b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2AABB = Box2D.Collision.b2AABB
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2Fixture = Box2D.Dynamics.b2Fixture
        , b2World = Box2D.Dynamics.b2World
        , b2MassData = Box2D.Collision.Shapes.b2MassData
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
        , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
        , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
        , b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
        , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    // TODO: compute the scale depending of the size of the canvas.
    var SCALE = 30;

    /**
     * Factory to create the B2World.
     * {Bool} debug
     * {context}
     */
    function B2WorldFactory(debug, ctx) {
        var world = new b2World(new b2Vec2(0, 10), false);
        if (debug) {
            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(ctx);
            debugDraw.SetDrawScale(1.0);
            debugDraw.SetFillAlpha(0.3);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            world.SetDebugDraw(debugDraw);
        }
        return world;
    }

    /**
     * Create the Ground and the edge of the scene were evoluate the characters.
     */
    function Ground (_oB2World) {
      var SIZE = SCALE;
      var fixDef = new b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;

      var bodyDef = new b2BodyDef;

      bodyDef.type = b2Body.b2_staticBody;
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox(SIZE*20, SIZE*2);
      bodyDef.position.Set(SIZE*10, SIZE * 400 / 30 + 1.8);
      _oB2World.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.position.Set(SIZE * 10, SIZE * -1.8);
      _oB2World.CreateBody(bodyDef).CreateFixture(fixDef);
      fixDef.shape.SetAsBox(SIZE*2, SIZE*14);
      bodyDef.position.Set(SIZE*-1.8, SIZE*13);
      _oB2World.CreateBody(bodyDef).CreateFixture(fixDef);
      bodyDef.position.Set(SIZE*21.8, SIZE*13);
      _oB2World.CreateBody(bodyDef).CreateFixture(fixDef);

      this.fixDef = fixDef;
      this.bodyDef = bodyDef;

      this.draw = function() {};
    }

    /**
     * Each character of the scene is represented as a triangle. That can
     * interact with the others.
     */
    function Triangle (dOptions) {

      var self = this;
      this.id = dOptions["id"] || Math.random()*60000;
      var SIZE = SCALE;
      var sin60 = 0.866;
      var cos60 = 0.5;
      var fixDef = new b2FixtureDef;
      fixDef.density = dOptions.density || 1.0;
      fixDef.friction = dOptions.density || 0.0;
      fixDef.restitution = dOptions.density || 0.9;

      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsArray([
        new b2Vec2(SIZE*sin60, SIZE*cos60),
        new b2Vec2(SIZE*-sin60, SIZE*cos60),
        new b2Vec2(0, SIZE*-1)], 3
      );

      var bodyDef = new b2BodyDef;
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.position.x = Math.random() * 200;
      bodyDef.position.y = Math.random() * 200;
      bodyDef.userData = {"id": self.id};

      this.fixDef = fixDef;
      this.bodyDef = bodyDef;

      this.b2Body = null;

      this.color = dOptions.color || "#000";

      /**
       * Method to render the object in the canvas.
       * Remind that box2d has been designed to be light so it doesn't provide
       * render methods.
       */
      this.draw = function(ctx) {
        var cos60 = 0.5;
        var sin60 = 0.866;

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.translate(this.b2Body.GetPosition().x,  this.b2Body.GetPosition().y);
        ctx.rotate(this.b2Body.GetAngle());
        ctx.moveTo(SIZE*sin60, SIZE*cos60);
        ctx.lineTo(SIZE*-sin60, SIZE*cos60);
        ctx.lineTo(0, SIZE*-1);
        ctx.fill();
        ctx.translate(0,0);
        ctx.restore();
      };
    }

    function loopDraw (_o2BWorld, shapes, _$ctx) {
      _$ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var b = _o2BWorld.GetBodyList(); b; b = b.m_next) {
        if (b.IsActive() && typeof b.GetUserData() !== 'undefined'
            && b.GetUserData() != null) {
          var id = b.GetUserData()["id"];
          shapes[id].b2Body = b;
          shapes[id].draw(_$ctx);
        }
      }
    }
    /**
     * Entry point.
     * main function, creates the scene and the characters and start the physical
     * loop.
     */
    (function main() {
      var SHAPES = {};
      var DEBUG = false;

      var $canvas = document.getElementById("canvas");
      var $context = $canvas.getContext("2d");
      var oB2World = B2WorldFactory(DEBUG, $context);
      new Ground(oB2World);

      // Create the characters.
      for(var i = 1; i < 10; ++i) {
        SHAPES[i] = new Triangle({"id" : i});
      }
      SHAPES["nicolas"] = new Triangle({"id": "nicolas", "color": "#FF2A2A"})

      // Add characters to the scene (oB2World)
      for (var index in SHAPES) {
        var oB2Body = oB2World.CreateBody(SHAPES[index].bodyDef);
        oB2Body.CreateFixture(SHAPES[index].fixDef);
        SHAPES[index].b2Body = oB2Body;
      }

      // Main loop.
      // At each step, use box2d method to recompute each triangle position,
      // and redraw the object in the canvas.
      (function loop() {
          var stepRate = 1 / 60;
          oB2World.Step(stepRate, 10, 10);
          oB2World.ClearForces();

          if (DEBUG) {
              oB2World.DrawDebugData();
          } else {
            loopDraw(oB2World, SHAPES, $context);
          }
          requestAnimFrame(loop);
      })();


    })();
})();
