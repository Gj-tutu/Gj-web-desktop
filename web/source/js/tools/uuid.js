/**
 * Created by tutu on 15-8-19.
 */

var uuid = {
    randMath: function() {
        var b = new Array(16);
        for (var i = 0, r; i < 16; i++) {
            if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
            b[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }
        return b;
    },
    uuidParse: function(buf, offset){
        var _byteToHex = [];
        var _hexToByte = {};
        for (var i = 0; i < 256; i++) {
            _byteToHex[i] = (i + 0x100).toString(16).substr(1);
            _hexToByte[_byteToHex[i]] = i;
        }
        var i = offset || 0, bth = _byteToHex;
        return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
    },
    get: function(){
        var rnds = this.randMath();
        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80;
        return this.uuidParse(rnds);;
    }
};

module.exports = uuid;