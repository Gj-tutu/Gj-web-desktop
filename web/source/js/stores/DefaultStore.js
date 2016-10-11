/**
 * Created by tutu on 15-8-17.
 */

var Constants = require('../constants/Constants');
var Actions = require('../actions/Actions');
var StoreNotice = require('../notices/StoreNotice');
var Promise = require("es6-promise");

var Store = {

    init: function() {
        StoreNotice.addStore(this);
    },

    destroy: function() {
        StoreNotice.removeStore(this.name);
    },

    before: function(action, data, key) {
        if(key){
            Actions.storeNoReply(key, this.name, action, Constants.listen.BEFORE, data);
        }else{
            Actions.storeNotice(this.name, action, Constants.listen.BEFORE, data);
        }
    },

    after: function(action, data, key) {
        if(key){
            Actions.storeNoReply(key, this.name, action, Constants.listen.AFTER, data);
        }else{
            Actions.storeNotice(this.name, action, Constants.listen.AFTER, data);
        }
    },

    handle: function(action, data, key) {
        this.before(action, data, key);
        var self = this;
        this.process(action, data).then(function(request){
            self.after(action, self.result(null, request), key);
        }).catch(function(error){
            self.after(action, self.result(error, null), key);
        });
    },

    result: function(error, request) {
        if(error){
            return {status: 1, result: error}
        }
        return {status: 0, result: request}
    }
};

module.exports = Store;
