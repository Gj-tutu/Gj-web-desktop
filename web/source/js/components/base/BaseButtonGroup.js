/**
 * Created by tutu on 15-8-26.
 */

var BaseButton = require('./BaseButton');
var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");

var BaseButtonGroup = React.createClass({

    mixins: [Element(), Default()],

    render: function() {
        return (
            <div className="base-button-group btn-group">
                {this.props.buttons.map(this.setButton)}
            </div>
        );
    },

    setButton: function(item) {
        return <BaseButton data={item.data} action={item.action} title={item.title} status={item.status} />;
    }
});

module.exports = BaseButtonGroup;