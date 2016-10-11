/**
 * Created by tutu on 15-8-19.
 */

var Demo = require("./work/Demo");
var Constants = require("../constants/Constants");

var workMap = {};
workMap[Constants.workType.DEMO] = Demo;

var Works = {
    render: function (workItem, gKey, selected){
        if (workMap[workItem.type]){
            return React.createElement(workMap[workItem.type],
                {gKey: gKey, size: workItem.size, key: workItem.workId, selected: selected, workId: workItem.workId})
        }else{
            return "";
        }
    }
};

module.exports = Works;
