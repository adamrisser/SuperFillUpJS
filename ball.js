(function () {
    
    /**
     * Generic ball
     * Never used directly, always extended. Dumb bag of methods.
     * @param {Object} game  sfu game instance
     * @param {Object} pos   initial position of the ball
     */
    sfu.Ball = {
        
        /**
         * SFU game instance
         * @public
         */
        game: null,
        
        /**
         * Position of ball
         * @public
         */
        pos: null,
        
        /**
         * Velocity of ball
         * @public
         */
        v: null,
        
        /**
         * Ball radius
         * @public
         */
        radius: 1,
        
        /**
         * Stroke Size
         * @public
         */
        strokeWidth: 0,        
        
        /**
         * Render the ball at a specified position
         * @public
         */
        draw: function () {
            
            var self = this,
                game = self.game,
                ctx  = game.ctx;
            
            ctx.save();
            
            ctx.translate(self.pos.x, self.pos.y);
            ctx.fillStyle = self.color;
            
            ctx.beginPath();
            ctx.arc(0, 0, self.radius, 0, Math.PI * 2, true);
            
            ctx.lineWidth = self.strokeWidth;
            ctx.strokeStyle = "#000";
            ctx.stroke();
                    
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        
        /**
         * Did we hit a wall?
         * Reverse the velocity vector appropriately
         * @public
         * @param {Function} callback
         */
        handleWallCollision: function (callback) {
            
            callback = callback || function (){};
            
            var self = this,
                game = self.game,
                radius = self.radius;
            
            // right walls
            if (self.pos.x > game.width - radius) {
                self.pos.x = game.width - radius;
                self.v.x = -Math.abs(self.v.x);
                callback();
            }
            // left wall
            else if (self.pos.x < radius) {
                self.pos.x = radius;
                self.v.x = Math.abs(self.v.x);
                callback();
            }
            
            if (self.pos.y > game.height - radius) {
                self.pos.y = game.height - radius;
                self.v.y = -Math.abs(self.v.y);
                callback();
            }
            else if (self.pos.y < radius) {
                self.pos.y = radius;
                self.v.y = Math.abs(self.v.y);
                callback();
            }
        }
        
    }
    
}());