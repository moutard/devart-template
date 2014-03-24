(function(_ni) {
    // Init som useful stuff for easier access (don't need 'em all)
    var   b2Vec2 = Box2D.Common.Math.b2Vec2
        , b2BodyDef = Box2D.Dynamics.b2BodyDef
        , b2Body = Box2D.Dynamics.b2Body
        , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

  // Le petit nicolas namespace
  var ni = _ni || {};

  /**
   * Each character of the scene is represented as a triangle. That can
   * interact with the others.
   */
  ni.Character = function (dOptions) {

      var self = this;
      this.id = dOptions['id'] || Math.random()*60000;
      var SIZE = dOptions['size'] || 30;
      var sin60 = 0.866;
      var cos60 = 0.5;
      var fixDef = new b2FixtureDef;
      fixDef.density = dOptions['density'] || 1.0;
      fixDef.friction = dOptions['friction'] || 0.0;
      fixDef.restitution = dOptions['restitution'] || 0.9;

      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsArray([
        new b2Vec2(SIZE*sin60, SIZE*cos60),
        new b2Vec2(SIZE*-sin60, SIZE*cos60),
        new b2Vec2(0, SIZE*-1)], 3
      );

      var bodyDef = new b2BodyDef;
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.position.x = dOptions['x'] || Math.random() * 200;
      bodyDef.position.y = dOptions['y'] || Math.random() * 200;
      bodyDef.userData = {"id": self.id};

      this.fixDef = fixDef;
      this.bodyDef = bodyDef;

      this.b2Body = null;

      this.color = dOptions['color'] || "#000";

      this.goBacktoInitialPosition = function() {

      };

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
    };
})(ni);
