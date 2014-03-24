(function(_ni) {

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

    // nicolas namespace
    var ni = _ni || {};

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
      var iCanvasHeight = $canvas.height;
      var iCanvasWidth = $canvas.width;
      var $context = $canvas.getContext("2d");
      var oB2World = B2WorldFactory(DEBUG, $context);

      var oClassroom = new ni.Classroom(oB2World, iCanvasWidth, iCanvasHeight);

      // Create the characters.
      for(var i = 1; i < 10; ++i) {
        SHAPES[i] = new ni.Character({'id' : i, 'size': SCALE, 'x': i * 2* SCALE, 'y': SCALE });
      }
      SHAPES["nicolas"] = new ni.Character({"id": "nicolas", "color": "#FF2A2A", "size": SCALE})

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
})(ni);
