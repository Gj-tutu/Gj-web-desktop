/**
 * Created by tutu on 15-8-26.
 */

var ToolbarItem = require("./ToolbarItem");
var Component = require("../../mixins/Component");
var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");
var Constants = require("../../constants/Constants");

var ToolbarList = React.createClass({

    mixins: [Element(), Default()],

    render: function() {
        return (
            <div className="toolbar-list">
                {this.props.moduleList.map(this.setItem)}
            </div>
        );
    },

    setItem: function(item, index) {
        return <ToolbarItem gKey={this.getGKey()} key={index} name={item.name} type={item.type} />
    }
});

module.exports = ToolbarList;