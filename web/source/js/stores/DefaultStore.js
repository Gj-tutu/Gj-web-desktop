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

    save: function(data) {
        this.before(Constants.storeHandle.SAVE, data);
        var self = this;
        this.handleSave(data).then(function(request){
            self.after(Constants.storeHandle.SAVE, this.successRequest(request));
        }).catch(function(request){
            self.after(Constants.storeHandle.SAVE, this.errorRequest(request));
        });
    },

    delete: function(data) {
        this.before(Constants.storeHandle.DELETE, data);
        var self = this;
        this.handleDel(data).then(function(request){
            self.after(Constants.storeHandle.DELETE, this.successRequest(request));
        }).catch(function(request){
            self.after(Constants.storeHandle.DELETE, this.errorRequest(request));
        });
    },

    get: function(data, key) {
        this.before(Constants.storeHandle.GET, data, key);
        var self = this;
        this.handleGet(data).then(function(request){
            self.after(Constants.storeHandle.GET, self.successRequest(request), key);
        }).catch(function(request){
            self.after(Constants.storeHandle.GET, self.errorRequest(request), key);
        });
    },

    successRequest: function(request) {
        return {status: 0, result: request}
    },

    errorRequest: function(request) {
        return {status: 1, result: request}
    }
};

module.exports = Store;