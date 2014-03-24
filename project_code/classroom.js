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
    ni.Classroom = function (_oB2World, iWidth, iHeight) {
      var fixDef = new b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;

      var bodyDef = new b2BodyDef;

      var iWall = 2;
      bodyDef.type = b2Body.b2_staticBody;
      fixDef.shape = new b2PolygonShape;
      // roof
      fixDef.shape.SetAsBox(iWidth, iWall);
      bodyDef.position.Set(0, 0);
      _oB2World.CreateBody(bodyDef).CreateFixture(fixDef);

      // floor
      fixDef.shape.SetAsBox(iWidth, iWall);
      bodyDef.position.Set(0, iHeight);
      _oB2World.CreateBody(bodyDef).CreateFixture(fixDef);

      // left wall
      fixDef.shape.SetAsBox(iWall, iHeight);
      bodyDef.position.Set(0, 0);
      _oB2World.CreateBody(bodyDef).CreateFixture(fixDef);

      // rigth wall
      fixDef.shape.SetAsBox(iWall, iHeight);
      bodyDef.position.Set(iWidth - iWall, 0);
      _oB2World.CreateBody(bodyDef).CreateFixture(fixDef);

      this.fixDef = fixDef;
      this.bodyDef = bodyDef;

      this.draw = function() {
        // Do nothing classroom is just use to delimitate the movement of the
        // characters.
      };
    };

})(ni);
