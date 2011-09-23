(function(){
    
    /**
     * A simple utility bucket. I didn't want to use a full
     * library like jQuery, but if this library grows too much,
     * the switch should be made.
     */
    sfu.util = {
        /**
         * Simple getElementById shortcut
         * @public
         * @param {String} id
         * return {HTMLElement}
         */
        $: function (id) {
            return document.getElementById(id);
        },
        
        /**
         * Return random number
         * @public
         * @param  {Number} number to mod by
         * @return {Number} random number
         */
        getRand: function (mod) {
            return Math.floor(Math.random() * (mod || 1100));
        },
        
        /**
         * Simple Extend method. If this grows to need something more complex,
         * move to jQuery.
         * 
         * Takes 1..n objects and mashes then together. Each passed in object
         * will overwrite the last one that was passed in.
         * 
         * @param  {Object} copyFrom 1..n args
         * @return {Object} newly created object
         */
        extend: function () {
            var newObj = {},
                argument,
                i = 0,
                n;
            
            for (; argument = arguments[i]; i++) {
                for (n in argument) {
                    newObj[n] = argument[n];
                }
            }
            
            return newObj;
        }
    }
}());