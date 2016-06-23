'use strict';
(function (){
    var Web = require('./components/Web');
    var app = require('./app');

    React.render(<Web />, app.container);
})();