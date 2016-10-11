/**
 * Created by tutu on 15-8-18.
 */

var uuid = require("../tools/uuid");
var ComNotice = require("../notices/ComNotice");
var Constants = require("../constants/Constants");
var Actions = require("../actions/Actions");

var Component = function() {

    return {
        componentKey: undefined,

        componentWillMount: function() {
            this.componentKey = uuid.get();
            ComNotice.addComponent(this.componentKey);
        },

        componentWillUnmount: function() {
            ComNotice.removeComponent(this.componentKey);
        },

        getData: function(store, data, before, after) {
            this.binds(store+Constants.storeActionType.GET, {BEFORE: before, AFTER: after}, true);
            Actions.storeHandle(store, Constants.storeActionType.GET, data, this.componentKey);
        },

        binds: function(action, callbacks, once) {
            var item;
            for(item in Constants.listen){
                if(callbacks[item]){
                    if(once){
                        this.bindOnce(action+Constants.listen[item], callbacks[item]);
                    }else{
                        this.bind(action+Constants.listen[item], callbacks[item]);
                    }
                }
            }
        },

        bindOnce: function(action, callback) {
            ComNotice.once(this.componentKey, action, callback);
        },

        bind: function(action, callback) {
            ComNotice.addListener(this.componentKey, action, callback);
        },

        unbind: function(action, callback) {
            ComNotice.removeListener(this.componentKey, action, callback);
        },

        sendNotice: function(action, data) {
            Actions.comNotice(this.componentKey, action, data);
        }
    }
};

module.exports = Component;
