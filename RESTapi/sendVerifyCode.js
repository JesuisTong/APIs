var express = require('express');
var util = require('util');

const sendCode = express.Router();

const segement = (path) => {
    const urlList = path.replace(/(^\/)|(\/$)/g, '').split('/');
    return urlList[1] || '';
};

sendCode.get('/send/*', function(req, res, next) {
	const type = segement(req.path);
	if (type === 'msg') {

	}
	if (type === 'vol') {

	}
	util.log('send a message');
	res.writeHead(200, {
		'Access-Control-Allow-Origin': '*',
        'transfer-encoding': 'chunked',
        'Content-Type': 'application/json; charset=utf-8',
	});
	const data = {
		code: 0,
		verifyCode: `${Math.floor(Math.random() * 9999) + 1000}`.slice(0,4),
		msg: '抛出一个成功的请求，并且你得去填一个Code',
	};
	res.write(JSON.stringify(data));
	res.end();
});

module.exports = sendCode;