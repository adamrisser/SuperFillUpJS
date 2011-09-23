(function () {
    
    /**
     * Bad Ball - An enemy ball that costs the player lives when touched
     * @param {Object} game  sfu game instance
     * @param {Object} pos   initial position of the ball
     * @param {Object} vel   initial velocity 
     */
    //TODO: does this need game?? should it??
    sfu.BadBall = function (game, pos, vel, radius) {
        
        var self = this;
        
        /**
         * SFU game instance
         * @public
         */
        self.game = game;
        
        /**
         * Radius of the ball
         * @public
         * @override
         */
        self.radius = radius;
        
        /**
         * Position of ball
         * @public
         */
        self.pos = pos;
        
        /**
         * Velocity of ball
         * @public
         */
        self.v = vel;
        
        /**
         * Color
         * @public
         */
        self.color = '#c00';
        
        /**
         * Bounced by which ball?
         * Default to self, since it will never get checked against itself.
         * (Cannot use null or undefined)
         * @public
         */
        self.bouncedBy = self;
        
    };
    
    /**
     * Extend from generic ball class
     */
    sfu.BadBall.prototype = sfu.util.extend(sfu.Ball, {
        
        /**
         * Update position of ball after a collision
         * @param {Object} ball    ball that is colliding
         */
        handleCollision: function (ball) {
            
            var self = this,
                
                x1 = self.pos.x,
                y1 = self.pos.y,
                
                x2 = ball.pos.x,
                y2 = ball.pos.y,
                
                // get each vector of the distance between the two balls
                dx = x2 - x1, 
                dy = y2 - y1,
                
                // find hypoteneuse
                dist = Math.sqrt(dx * dx + dy * dy),
                
                // find the normal vector
            	normalX = dx / dist,
            	normalY = dy / dist,
                
                // find the midpoint between each ball
            	midpointX = (x1 + x2) / 2,
            	midpointY = (y1 + y2) / 2,
                
                // calculate the difference in velocities
                dvx = self.v.x - ball.v.x,
                dvy = self.v.y - ball.v.y,
                
                dVector,
                selfVDiff,
                ballVDiff;
            
            // change the position of each ball so they don't touch
        	self.pos.x = midpointX - normalX * self.radius;
        	self.pos.y = midpointY - normalY * self.radius;
        	ball.pos.x = midpointX + normalX * ball.radius;
        	ball.pos.y = midpointY + normalY * ball.radius;
            
            // dot product to find new velocities
        	dVector = dvx * normalX + dvy * normalY;
            
            // calculate new velocities
        	dvx = dVector * normalX;
        	dvy = dVector * normalY;
            
        	// set new velocities
        	self.v.x -= dvx;
        	self.v.y -= dvy;
        	ball.v.x += dvx;
        	ball.v.y += dvy;

            // normalize speeds (bad balls only)
            selfVDiff = (10 - (Math.abs(self.v.x) + Math.abs(self.v.y))) * 0.5;
            self.v.x += self.v.x < 0 ? -selfVDiff : selfVDiff;
        	self.v.y += self.v.y < 0 ? -selfVDiff : selfVDiff;
            
            // TODO: move check to util
            if (ball instanceof sfu.GoodBall && ball.isSet) {
                ballVDiff = (10 - (Math.abs(ball.v.x) + Math.abs(ball.v.y))) * 0.5;
        	    ball.v.x += ball.v.x < 0 ? -ballVDiff : ballVDiff; 
        	    ball.v.y += ball.v.y < 0 ? -ballVDiff : ballVDiff;
            }
            
            // make sure its not going past a wall
            self.handleWallCollision();
            ball.handleWallCollision();
        },
        
        /**
         * Update the position of the ball
         * @public
         */        
        update: function () {
            
            var self = this,
                game = self.game,
                radius = self.radius,
                v = self.v,
                i = 0,
                ball;
            
            self.handleWallCollision();
            
            // check for ball collision
            for (; ball = game.balls[i]; i++) {
                
                // check for collisions
                if (game.hasColliding(self, ball) && self.bouncedBy !== ball) {
                    
                    // hit a bad ball or a good ball that is locked?
                    if ((ball instanceof sfu.BadBall) || (ball instanceof sfu.GoodBall && ball.isSet)) {
                        self.bouncedBy = ball;
                        ball.bouncedBy = self;
                        self.handleCollision(ball);
                        return;
                    } 
                }
            }
            
            self.pos.x += Math.floor(v.x);
            self.pos.y += Math.floor(v.y);
            self.bouncedBy = self;
        }
        
    });
    
}());