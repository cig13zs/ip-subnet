const assert = require('assert');
const IPSubnet = require('./core');

const res = IPSubnet.calculate('192.168.1.100/24');
assert.strictEqual(res.netmask, '255.255.255.0');
assert.strictEqual(res.networkAddress, '192.168.1.0');
assert.strictEqual(res.broadcastAddress, '192.168.1.255');
assert.strictEqual(res.usableHosts, 254);

assert.deepStrictEqual(IPSubnet.calculate('999.168.1.1/24'), { error: 'Invalid IPv4 address' });
assert.deepStrictEqual(IPSubnet.calculate('192.168.1/24'), { error: 'Invalid IPv4 address' });
assert.deepStrictEqual(IPSubnet.calculate('192.168.1.1/24oops'), { error: 'Invalid CIDR prefix (0-32)' });
assert.deepStrictEqual(IPSubnet.calculate('192.168.1.1/33'), { error: 'Invalid CIDR prefix (0-32)' });
assert.strictEqual(IPSubnet.ipToInt('256.0.0.1'), null);

const singleHost = IPSubnet.calculate('203.0.113.7/32');
assert.strictEqual(singleHost.networkAddress, '203.0.113.7');
assert.strictEqual(singleHost.broadcastAddress, '203.0.113.7');
assert.strictEqual(singleHost.totalHosts, 1);
assert.strictEqual(singleHost.usableHosts, 1);

console.log('ok, all IPSubnet assertions passed');
