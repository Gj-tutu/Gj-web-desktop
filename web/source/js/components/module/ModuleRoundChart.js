/**
 * Created by tutu on 15-8-26.
 */

var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");

var ModuleRoundChart = React.createClass({

    mixins: [Element(), Default()],

    render: function() {
        return (
            <div className="module-round-chart">
            </div>
        );
    }
});

module.exports = ModuleRoundChart;