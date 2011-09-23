(function () {
    
    /*global document*/
    var _doc = document,
        _util = sfu.util,
    
    /**
     * How much area must be filled to pass a level
     * #private
     */
    _AREA_LIMIT = 66.6,
    
    /**
     * Start button for game node
     * @private
     */
    _startNode;
    
    /**
     * Super fill up game
     * @public
     * @param {Number} width  width of canvas
     * @param {Number} height height of canvas
     */
    sfu.Game = function (width, height) {
        
        var self = this;
        
        /**
         * Canvas for the game
         * @public
         */
        canvas = self.canvas = _util.$('main');
        
        /**
         * Width of game
         * @public
         */
        self.width = width;
        
        /**
         * Height of game
         * @public
         */
        self.height = height;
        
        /**
         * Drawing context
         * @public
         */
        self.ctx = this.canvas.getContext("2d");
        
        /**
         * Heads up Display
         * @public
         */
        self.hud = new sfu.Hud(self);
        
        /**
         * Game has started flag
         * @public
         */
        self.hasStarted = false;
        
        /**
         * How much of the game f
         * @public
         */
        self.filled = 0;
        
        /**
         * What level the player is on
         * @public
         */
        self.level = 1;
        
        /**
         * How many circles are left for the player to use
         * @public
         */
        self.ballsLeft = 20;
        
        /**
         * How many lives the player has left before the game is over
         * @public
         */
        self.lives = 2;
        
        /**
         * Array to store balls that break the player's circles
         * @public
         */
        self.balls = [];
         
        /**
         * Reference to the ball that the user is currently growing
         * @public
         */
        self.growingBall = null;
        
        /**
         * Level start time
         * @public
         */
        self.startTime = 0;
        
        /**
         * Mouse coordinates
         * @public
         */
        self.mouse = { 
            x: 0.0,
            y: 0.0
        };
        
        //TODO: place elsewhere
        _startNode = _util.$('clickToPlay');
        
        // capture clicks onto the canvas
        self.canvas.addEventListener("mousedown", function (e) {
            if (self.hasStarted) {
                self.addGoodBall(e.clientX - self.canvas.offsetLeft, e.clientY - self.canvas.offsetTop);
            }
        }, false);
        
        // capture clicks onto the canvas
        self.canvas.addEventListener("mouseup", function (e) {
            if (self.hasStarted && self.growingBall) {
                self.lockBall();
            }
        }, false);
        
        // capture mouse coordinates and store so they are easily referencable 
        self.canvas.addEventListener("mousemove", function (e) {
            if (typeof e.offsetX !== 'undefined') {
                self.mouse.x = e.offsetX - self.canvas.offsetLeft;
                self.mouse.y = e.offsetY - self.canvas.offsetTop;
            }
            else if (typeof e.layerX !== 'undefined') {
                self.mouse.x = e.layerX - self.canvas.offsetLeft;
                self.mouse.y = e.layerY - self.canvas.offsetTop;
            }    
        }, false);
        
    };
    
    sfu.Game.prototype = {
        
        /**
         * Start the game!
         * @public
         */
        start: function () {
            var self = this,
                main;
            
            // update the hud with the starting values
            self.hud.update();
            
            // start the game!
            self.hasStarted = true;
            
            // start the clock!
            self.startTime = new Date().getTime();
            
            // main game animation loop
            main = window.setInterval(function () {
                
                self.clear();
                
                var i = 0, j, ball;
                
                // game over?
                if (self.ballsLeft < 1 || self.lives < 1) {
                    //TODO: game over screen
                    self.displayScreen("Game over!", true);
                    clearInterval(main);
                    return;
                }
                
                // did they player beat the level?
                if (self.filled >= _AREA_LIMIT) {
                    self.level += 1;
                    self.hasStarted = false;
                    self.displayScreen("Level Complete!");
                    self.clear();
                    clearInterval(main);
                    return;
                }
                
                // has the user started a new good ball?
                if (self.growingBall) {
                    
                    // check for collision
                    for (i = 0; ball = self.balls[i]; i++) {
                        
                        // check for collisions
                        if (self.hasColliding(self.growingBall, ball)) {
                            
                            // bad ball collision? burn a life
                            if (ball instanceof sfu.BadBall) {
                                self.lives--;
                                self.growingBall = null;
                                self.hud.update();  
                            } else {
                                self.lockBall();
                            }
                            
                            break;
                        }
                    }
                    
                    if (self.growingBall) {
                        self.growingBall.draw();
                        self.growingBall.update();
                    }
                }
                
                // update balls
                for (i = 0; ball = self.balls[i]; i++) {
                    ball.draw();
                    ball.update();
                }
                
            }, 30);
        },
        
        /**
         * Add enemy ball
         * @public
         */
        addBadBall: function () {
            var self = this,
                radius = 10,
                v = 10,
                tmpV = _util.getRand(v), 
                pos = {
                    x: _util.getRand(self.width),
                    y: _util.getRand(self.height)
                },
                vel = {
                    x: tmpV,
                    y: v - tmpV
                };
             
             self.balls.push(new sfu.BadBall(self, pos, vel, radius));
        },
        
        /**
         * Add good ball
         * @public
         * @param {Number} x mouse x coord
         * @param {Number} y mouse y coord
         */
        addGoodBall: function (x, y) {
            var self = this,
                pos = {
                    x: x,
                    y: y
                };
             
             self.ballsLeft -= 1;
             self.growingBall = new sfu.GoodBall(self, pos);
        },
        
        /**
         * Lock a growing ball into the playing field
         * @public
         */
        lockBall: function () {
            var self = this,
                r = self.growingBall.radius,
                ballArea = Math.PI * r * r,
                rectArea = self.width * self.height;
            
            // Move ball into balls array and remove from growing property
            self.growingBall.isSet = true;
            self.balls.push(self.growingBall);
            self.growingBall = null;
            
            self.filled = (parseFloat(self.filled) + parseFloat(100 * ballArea / rectArea)).toFixed(2);
            self.hud.update();
        },
        
        /**
         * Clear canvas
         * @public
         */
        clear: function () {
            var self = this;
            self.ctx.clearRect(0, 0, self.width, self.height);
        },
        
        /**
         * Init the level
         * @public
         * @param {level} level next level
         */
        initLevel: function (level) {
            var self = this,
                i = 0;
            
            self.balls  = [];
            self.filled = 0;
            self.startTime = 0;
            self.lives = level + 1;
            self.ballsLeft = 18 + (level * 2);
            self.growingBall = null;
            
            //for (; i < level+1; i++) {
                self.addBadBall();
            //} 
            
            self.hud.update();
        },
        
        /**
         * Display the score screen. Shows inbetween level
         * @public
         * @param {String|null} msg Message title
         * @param {Boolean} msg Message title
         */
        displayScreen: function (msg, hideLink) {
            
            var self = this,
                stopTime = new Date().getTime(),
                secs = new Date().setTime(stopTime - self.startTime),
                levelComplete = _util.$('levelComplete');
                
            _util.$('ballsLeft').innerHTML = self.ballsLeft;
            _util.$('percent').innerHTML   = self.filled + '%';
            _util.$('time').innerHTML      = (secs / 1000).toFixed(2) + ' seconds!';
            _util.$('msg').innerHTML       = msg || "Game over!";
            
            if (hideLink) {
                _util.$('continue').style.display = 'none';
            }
            
            levelComplete.style.display = 'block';
        },
        
        /**
         * Return if two balls are colliding 
         * @param  {Object}  b1 ball 1
         * @param  {Object}  b2 ball 2
         * @return {Boolean}
         */
        //TODO: move somewhere, rename
        hasColliding: function (b1, b2) {
            var x1 = b1.pos.x,
                y1 = b1.pos.y,
                r1 = b1.radius,
                
                x2 = b2.pos.x,
                y2 = b2.pos.y,
                r2 = b2.radius,
                
                xd = x2 - x1,
                yd = y2 - y1;
            
            return b1 !== b2 && Math.sqrt(xd * xd + yd * yd) < r1 + r2;
        }
        
    }
    
}());