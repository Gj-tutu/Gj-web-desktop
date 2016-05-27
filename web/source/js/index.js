'use strict';

(function (){
    var Web = require('./components/Web');
    var app = require('./app');
    app.init();

    React.render(<Web />, app.container);
})();