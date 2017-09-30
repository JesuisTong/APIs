const os = require('os');

module.exports = function() {
	return os.networkInterfaces().en0.map((i) => (
		i.family === 'IPv4' ? i.address : ''
	)).join('');
}