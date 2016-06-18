/**
 * Created by tutu on 15-8-17.
 */

var Constants = require('../constants/Constants');
var Actions = require('../actions/Actions');
var StoreNotice = require('../notices/StoreNotice');
var Promise = require("es6-promise");
var app = require('../app');

var Store = {

    init: function() {
        StoreNotice.addStore(this);
    },

    destroy: function() {
        StoreNotice.removeStore(this.name);
    },

    before: function(handle, data, key) {
        if(key){
            Actions.storeNoReply(key, this.name, handle, Constants.listen.BEFORE, data);
        }else{
            Actions.storeNotice(this.name, handle, Constants.listen.BEFORE, data);
        }
    },

    after: function(handle, data, key) {
        if(key){
            Actions.storeNoReply(key, this.name, handle, Constants.listen.AFTER, data);
        }else{
            Actions.storeNotice(this.name, handle, Constants.listen.AFTER, data);
        }
    },

    handle: function(data) {
        this.before(Constants.storeAction.HANDLE, data);
        var self = this;
        this.process(data).then(function(request){
            self.after(Constants.storeAction.HANDLE, this.result(null, request));
        }).catch(function(error){
            self.after(Constants.storeAction.HANDLE, this.result(error, null));
        });
    },

    result: function(error, request) {
        if(error){
            return {status: 1, result: error}
        }
        return {status: 0, result: request}
    },

    process: function(data){
        return Promise;
    }
};

module.exports = Store;