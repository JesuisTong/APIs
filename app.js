const fs = require('fs');
const os = require('os');
const express = require('express');
const util = require('util');
const getIP = require('./Utils/getCurrentIP');
const sendCode = require('./RESTapi/sendVerifyCode');

const IP = getIP();
const app = express();
const tel = express.Router();
const checkCode = express.Router();
const req3 = express.Router();

// 读取用户数据进入缓存（list）
const { userinfo } = JSON.parse(fs.readFileSync('./static/information.json').toString());
let verifyCode = '';
// 检查电话是否已经注册
tel.get('/tel', function(req, res, next) {
	util.log('tel');
    const param = req.query || {};
    let data = '';
    if (userinfo.some(item => (`${item.tel}` === `${param.tel}`))) {
        data = {
            code: 1,
            msg: '此手机已被认证',
        };
    } else {
        verifyCode = `${Math.floor(Math.random() * 9999) + 1000}`.slice(0,4);
        data = {
            code: 0,
            msg: '验证通过',
            verifyCode,
        };
    }
    res.writeHead(200, {
    	'Access-Control-Allow-Origin': '*',
    	'transfer-encoding': 'chunked',
    	'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
    })
    res.write(JSON.stringify(data));
    res.end();
    // res.status(200).send(data);
});
// 检查验证码是否正确
checkCode.get('/code', function(req, res) {
	util.log('code');
    const param = req.query || {};
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'transfer-encoding': 'chunked',
        'Content-Type': 'application/json; charset=utf-8',
    })
    if (param.code * 1 === verifyCode * 1) {
        res.write(JSON.stringify({
            code: 0,
            msg: '验证成功！',
        }));
    } else {
        res.write(JSON.stringify({
            code: 100,
            msg: '验证失败！',
        }));
    }
    res.end();
});
// msg
req3.get('/msg', function(req, res) {
    util.log('msg');

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'transfer-encoding': 'chunked',
        'Content-Type': 'application/json; charset=utf-8',
    })
    const data = {
        msg: `${Math.floor(Math.random() * 9999) + 1000}`.slice(0,4),
    };
    res.write(JSON.stringify(data));
    res.end();
})
app.use(tel, checkCode, req3, sendCode, express.static('static'));

app.set('host', IP);
app.set('port', '3001');
var server = app.listen(app.get('port'), app.get('host'), function() {
    util.log(`server listening at ${app.get('host')}:${app.get('port')}......`);
})

