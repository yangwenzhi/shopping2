return module.exports = {
    extend: function(subClass, superClass){
        var F = function(){};
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
        subClass.__super__ = superClass.prototype;
        if (superClass.prototype.constructor == Object.prototype.constructor)
            superClass.prototype.constructor = superClass;
    },

    bind: function(func, context){ //https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
        if(typeof func !== 'function')
            throw new TypeError;
        var bound, args, slice = Array.prototype.slice;
        args = slice.call(arguments, 2);
        return bound = function() {
            if(!(this instanceof bound))
                return func.apply(context, args.concat(slice.call(arguments)));
            var fnop = function(){};
            fnop.prototype = func.prototype;
            var self = new fnop;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            return Object(result) === result ? result : self;
        }
    }
}
