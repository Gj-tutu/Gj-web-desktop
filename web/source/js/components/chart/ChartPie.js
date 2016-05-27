/**
 * Created by tutu on 15-8-26.
 */

var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");
var WorkItem = require("../../mixins/WorkItem");
var Chart = require("../../mixins/Chart");

var ChartBar = React.createClass({

    mixins: [Element(), Default(), WorkItem(), Chart()],

    getInitialState: function() {
        return {option: this.init(this.props.title, this.props.data)};
    },

    render: function() {
        return (
            <div className="chart-pie" ref="chart"></div>
        );
    },

    init: function(title, data) {
        var i, legend=[], legendKey=[], series=[];
        for(i=0;i<title.length;i++){
            legend.push(title[i]["name"]);
            legendKey.push(title[i]["key"]);
            series.push({value: data[title[i]["key"]], name: title[i]["name"]});
        }
        return {
            tooltip : {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            legend: {
                data:legend
            },
            series : [
                {
                    type:'pie',
                    data:series
                }
            ]
        };
    }
});

module.exports = ChartBar;