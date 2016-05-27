/**
 * Created by tutu on 15-8-18.
 */

var uuid = require("../tools/uuid");
var EleNotice = require("../notices/EleNotice");
var Actions = require("../actions/Actions");
var Constants = require("../constants/Constants");

var Element = function() {

    return {
        elementKey: undefined,

        componentWillMount: function() {
            this.elementKey = uuid.get();
            EleNotice.addElement(this.elementKey);
            this.parComponentKey = this.props.gKey;
        },

        componentWillUnmount: function() {
            EleNotice.removeElement(this.elementKey);
        },

        onStoreHandle: function(store, handle, before, after) {
            this.watchs(store+handle, {BEFORE: before, AFTER: after});
        },

        watchs: function(event, callbacks) {
            var item;
            for(item in Constants.listen){
                if(callbacks[item]) this.watch(event+Constants.listen[item], callbacks[item]);
            }
        },

        watch: function(event, callback) {
            EleNotice.addListener(this.elementKey, event, callback);
        },

        unWatch: function(event, callback) {
            EleNotice.removeListener(this.elementKey, event, callback);
        },

        storeHandle: function(store, handle, data) {
            Actions.storeHandle(store, handle, data);
        },

        event: function(event, data) {
            Actions.event(event, data);
        },

        handle: function(handle, data, callback) {
            Actions.handle(this.parComponentKey, handle, data, callback);
        },

        collect: function(action, callback) {
            this.watch(this.parComponentKey+action, callback);
        }
    }
};

module.exports = Element;