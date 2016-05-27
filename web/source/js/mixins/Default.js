/**
 * Created by tutu on 15-8-18.
 */

var Default = function() {
    return {
        getGKey: function(){
            return this.componentKey ? this.componentKey : this.parComponentKey;
        }
    }
};

module.exports = Default;