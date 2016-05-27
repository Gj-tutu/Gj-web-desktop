/**
 * Created by tutu on 15-8-19.
 */

var Workspace = require("./Workspace");
var Toolbar = require("./Toolbar");
var Component = require("../mixins/Component");
var Default = require("../mixins/Default");

var Web = React.createClass({

    mixins: [Component(), Default()],

    render: function() {
        return (
            <div>
                <Workspace gKey={this.getGKey()}/>
                <Toolbar gKey={this.getGKey()}/>
            </div>
        );
    }
});

module.exports = Web;