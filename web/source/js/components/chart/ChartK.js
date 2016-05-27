/**
 * Created by tutu on 15-8-26.
 */

var Element = require("../../mixins/Element");
var Default = require("../../mixins/Default");
var WorkItem = require("../../mixins/WorkItem");
var Chart = require("../../mixins/Chart");

var ChartK = React.createClass({

    mixins: [Element(), Default(), WorkItem(), Chart()],

    getInitialState: function() {
        return {option: this.init(this.props.k, this.props.title, this.props.data, this.props.timeKey)};
    },

    render: function() {
        return (
            <div className="chart-k" ref="chart"></div>
        );
    },

    init: function(k, title, data, timeKey) {
        var i, l, legend=[], legendKey=[], xAxis=[], kD=[], kI=[], series=[];
        for(i=0;i<title.length;i++){
            legend.push(title[i]["name"]);
            legendKey.push(title[i]["key"]);
            series.push([]);
        }
        for(i=0;i<data.length;i++){
            kI = [];
            for(l=0;l<k.key.length;l++){
                kI.push(data[i][k.key[l]["key"]]);
            }
            kD.push(kI);
            xAxis.push(data[i][timeKey]);
            for(l=0;l<legendKey.length;l++){
                series[l].push(data[i][legendKey[l]]);
            }
        }
        series = this.getSeries(series, legend);
        series.unshift(this.getK(k, kD));
        legend.unshift(k.name);
        return {
            legend: {
                data: legend
            },
            tooltip : {
                trigger: 'axis',
                formatter: function (params) {
                    var res = k.name;
                    for(l=0;l<k.key.length;l++){
                        res += '<br/>  '+ k.key[l]["name"] +' : ' + params[0].value[l];
                    }
                    return res;
                }
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
                    boundaryGap : true,
                    data : xAxis
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    scale: true
                },
                {
                    type : 'value',
                    scale: true
                }
            ],
            series : series
        };
    },

    getK: function(k, kD) {
        return {
            name: k.name,
            type: "k",
            yAxisIndex: 0,
            data: kD
        };
    },

    getSeries: function(series, legend) {
        var result = [];
        for(var i=0;i<series.length;i++){
            result.push({
                name: legend[i],
                type:'line',
                yAxisIndex: 1,
                data: series[i]
            });
        }
        return result;
    }
});

module.exports = ChartK;