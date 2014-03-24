(function(_ni) {
    // Init som useful stuff for easier access (don't need 'em all)
    var   b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

    var ni = _ni || {};
    /**
     * Create the Ground and the edge of the scene were evoluate the characters.
     */
    ni.Classroom = function (_oB2World, SCALE) {
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

      this.draw = function() {
        // Do nothing classroom is just use to delimitate the movement of the
        // characters.
      };
    };

})(ni);
