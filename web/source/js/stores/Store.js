/**
 * Created by tutu on 15-8-17.
 */

var storeList = ['DemoStore'];

var Store = {
    init: function() {
        storeList.map((item, index)=>{
            require('./'+item)
        });
    }
};

module.exports = Store.init();
