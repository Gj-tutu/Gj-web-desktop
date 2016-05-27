/**
 * Created by tutu on 15-8-17.
 */

function initStore(item, index) {
    item.init();
}
var storeList = [
    require('./DemoStore')
];

var Store = {
    init: function() {
        storeList.map(initStore);
    }
};

module.exports = Store;