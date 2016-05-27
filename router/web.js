//web 路由 设置api相关接口

var express = require('express');
var web = express.Router();
var setting = require('../setting');

web.use('/static', express.static(setting.webPath + '/static'));

web.get('/*', function (req, res, next) {
    res.sendFile(setting.webPath + '/index.html');
});

module.exports = web;