/**
 * Created by tutu on 15-8-19.
 */

var Demo = require("./work/Demo");
var Constants = require("../constants/Constants");

var map = {};
map[Constants.workType.DEMO] = Demo;

var Works = {
    render: function (type, gKey, selected){
        if (map[type]){
            return React.createElement(map[type],
                {gKey: this.getGKey(), size: item.size, key: item.workId, selected: selected, workId: item.workId})
        }else{
            return "";
        }
    }
};

module.exports = Works;