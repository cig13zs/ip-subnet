;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.IPSubnet = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  function ipToInt(ip) {
    return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0;
  }

  function intToIp(int) {
    return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
  }

  function calculate(cidrStr) {
    if (!cidrStr || typeof cidrStr !== 'string') return null;
    const parts = cidrStr.trim().split('/');
    const ipStr = parts[0];
    const prefix = parts.length > 1 ? parseInt(parts[1], 10) : 24;

    if (prefix < 0 || prefix > 32) return { error: 'Invalid CIDR prefix (0-32)' };

    const ipInt = ipToInt(ipStr);
    const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

    const firstUsable = prefix >= 31 ? networkInt : networkInt + 1;
    const lastUsable = prefix >= 31 ? broadcastInt : broadcastInt - 1;

    return {
      ip: ipStr,
      prefix: prefix,
      netmask: intToIp(maskInt),
      networkAddress: intToIp(networkInt),
      broadcastAddress: intToIp(broadcastInt),
      firstHost: intToIp(firstUsable),
      lastHost: intToIp(lastUsable),
      totalHosts: totalHosts,
      usableHosts: usableHosts
    };
  }

  return { calculate: calculate, ipToInt: ipToInt, intToIp: intToIp };
});
