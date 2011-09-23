(function () {
    /*global document */
    // shortcuts
    var _doc = document,
        _$ = sfu.util.$;
    
    /**
     * HUD - Bar that shows player information
     * @param {Object} game    sfu game instance
     */
    sfu.Hud = function (game) {
        
        var self = this;
        
        /**
         * SFU game instance
         * @public
         */
        self.game = game;
        
        /**
         * Info area for how many chances the player has left to complete 
         * the level
         * @public
         */
        self.lives = _$('lives');
        
        /**
         * Info area for how much of the game area is filled with circles
         * @public
         */
        self.filledNode = _$('filled');
        
        /**
         * Info area for what level the player is on
         * @public
         */
        self.levelNode = _$('level');
        
        /**
         * Info area for how many circles are left for the player to use
         * @public
         */
        self.ballsNode = _$('balls');
        
        /**
         * Info area for how many chances the player has left to complete 
         * the level
         * @public
         */
        self.livesNode = _$('lives');
    };
    
    sfu.Hud.prototype = {
        
        /**
         * Update hud values
         * @public
         */
        update: function () {
            var self = this,
                game = self.game;
            
            self.filledNode.innerHTML = game.filled + '%';
            self.levelNode.innerHTML  = game.level;
            self.ballsNode.innerHTML  = game.ballsLeft;
            self.livesNode.innerHTML  = game.lives;
        }
        
    }
    
}());