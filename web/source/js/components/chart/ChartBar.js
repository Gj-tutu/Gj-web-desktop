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
        return {option: this.init(this.props.title, this.props.data, this.props.timeKey)};
    },

    render: function() {
        return (
            <div className="chart-bar" ref="chart"></div>
        );
    },

    init: function(title, data, timeKey) {
        var i, l, legend=[], legendKey=[], xAxis=[], series=[];
        for(i=0;i<title.length;i++){
            legend.push(title[i]["name"]);
            legendKey.push(title[i]["key"]);
            series.push([]);
        }
        for(i=0;i<data.length;i++){
            xAxis.push(data[i][timeKey]);
            for(l=0;l<legendKey.length;l++){
                series[l].push(data[i][legendKey[l]]);
            }
        }
        return {
            legend: {
                data: legend
            },
            dataZoom : {
                show : true,
                realtime: true,
                start : 50,
                end : 100
            },
            xAxis : [
                {
                    type : 'category',
                    data : xAxis
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    scale: true,
                    boundaryGap: [0.1, 0.1]
                }
            ],
            series : this.getSeries(series, legend)
        };
    },

    getSeries: function(series, legend) {
        var result = [];
        for(var i=0;i<series.length;i++){
            result.push({
                name: legend[i],
                type:'bar',
                data: series[i]
            });
        }
        return result;
    }

});

module.exports = ChartBar;