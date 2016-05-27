/**
 * Created by tutu on 15-11-11.
 */

var app = {
    init: function(){
        var store = require('./stores/Store');

        store.init();
    },
    container: document.getElementById('container'),
    logLevel: 0
};

module.exports = app;