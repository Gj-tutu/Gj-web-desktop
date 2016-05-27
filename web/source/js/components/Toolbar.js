/**
 * Created by tutu on 15-8-26.
 */

var ToolbarList = require("./toolBar/ToolbarList");
var Component = require("../mixins/Component");
var Element = require("../mixins/Element");
var Default = require("../mixins/Default");
var Constants = require("../constants/Constants");

var modules = [];
modules.push({name: "DEMO", type: Constants.workType.DEMO});

var Toolbar = React.createClass({

    mixins: [Component(), Element(), Default()],

    moduleList: [],

    componentWillMount: function() {
        for(var i in modules){
            this.moduleList.push(modules[i]);
        }
    },

    render: function() {
        return (
            <div className="toolbar">
                <ToolbarList gKey={this.getGKey()} moduleList={this.moduleList} />
            </div>
        );
    }
});

module.exports = Toolbar;