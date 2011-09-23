(function () {
    
    /**
     * How fast user generated circles grow
     * @constant
     */
    var _GROW_RATE = 2;
    
    /**
     * Player drown circle used to fill up the game area
     * @param {Object} game  sfu game instance
     * @param {Object} pos   initial position of the ball
     */
    //TODO: strip out game?
    sfu.GoodBall = function (game, pos) {
        
        var self = this;
        
        /**
         * SFU game instance
         * @public
         */
        self.game = game;
        
        /**
         * Position of ball
         * @public
         */
        self.pos = pos;
        
        /**
         * Position of ball
         * @public
         */
        self.v = {
            x: 0,
            y: 0
        };
        
        /**
         * Marks is the ball is not growing anymore
         * @public
         */
        self.isSet = false;
        
        /**
         * Color
         * @public
         */
        self.color = ['#0cc', '#c0c', '#cc0'][sfu.util.getRand(3)];
        
        /**
         * Stroke Size
         * @public
         */
        self.strokeWidth = 5;
    };
    
    /**
     * Extend from generic ball object
     */
    sfu.GoodBall.prototype = sfu.util.extend(sfu.Ball, {
        
        /**
         * Update the position of the ball
         * @public
         * @param {Object} mouse  position of mouse
         */        
        update: function (mouse) {
            
            var self = this,
                game = self.game,
                radius = self.radius,
                v = self.v;
            
            // mark as collided if the ball runs into a wall
            self.handleWallCollision(function () {
                self.isSet = true;
            });
            
            // too big! dont grow anymore
            if (self.isSet) {
                
                // only apply physics after ball is set
                self.pos.x += self.v.x;
                self.pos.y += self.v.y;
                
                // drag
                self.v.x *= .99;
                self.v.y *= .99;
                
                // gravity
                self.v.y += .25;
                                
                if (self.pos.y + radius > game.height - 1) {
                    self.pos.y = game.height - radius;
                    self.v.y = -Math.abs(self.v.y);
                    self.v.y *= 0.5;              
                }
                
                return; 
            }
            
            // keep growing!
            self.pos.x = game.mouse.x;
            self.pos.y = game.mouse.y;
            self.radius += _GROW_RATE;    
        }
    });
    
}());