/**
 * Created by tutu on 15-8-17.
 */

var DefaultStore = require('./DefaultStore');
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var DemoStore = assign({

    name: Constants.store.DEMO,

    handleSave: function (data) {
        return;
    },

    handleDel: function (data) {
        return;
    },

    handleGet: function (data) {
        return new Promise(function(resolve, reject){
            return setTimeout(function(){
                resolve(data);
            }, 1000);
        });
    }
}, DefaultStore);

module.exports = DemoStore;