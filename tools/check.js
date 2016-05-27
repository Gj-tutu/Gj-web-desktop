/**
 * Created by tutu on 15-11-20.
 */
var check = {};
check.isEmpty = function($c){
    if($c === null || this.isUndefined($c)) return true;
    if(this.isArray($c) || this.isString($c)){
        return this.isZero($c.length);
    }
    if(this.isNumber($c)){
        return this.isZero($c);
    }
    return false;
};
check.isZero = function($c){
    return $c === 0
};
check.isArray = function($c){
    return typeof $c === "array";
};
check.isString = function($c){
    return typeof $c === "string";
};
check.isNumber = function($c){
    return typeof $c === "number";
};
check.isFunction = function($c){
    return typeof $c === "function";
};
check.isUndefined = function($c){
    return typeof $c === "undefined";
};
check.isObject = function($c){
    return typeof $c === "object";
};
module.exports = check;