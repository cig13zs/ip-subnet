const assert = require('assert');
const IPSubnet = require('./core');

const res = IPSubnet.calculate('192.168.1.100/24');
assert.strictEqual(res.netmask, '255.255.255.0');
assert.strictEqual(res.networkAddress, '192.168.1.0');
assert.strictEqual(res.broadcastAddress, '192.168.1.255');
assert.strictEqual(res.usableHosts, 254);

console.log('ok, all IPSubnet assertions passed');
