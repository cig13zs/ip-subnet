;(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.IPSubnet = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  function parseIPv4(ip) {
    if (typeof ip !== 'string' || !/^\d{1,3}(?:\.\d{1,3}){3}$/.test(ip)) return null;

    const octets = ip.split('.').map(Number);
    return octets.every(octet => octet >= 0 && octet <= 255) ? octets : null;
  }

  function ipToInt(ip) {
    const octets = parseIPv4(ip);
    if (!octets) return null;
    return octets.reduce((acc, octet) => (acc * 256) + octet, 0) >>> 0;
  }

  function intToIp(int) {
    return [(int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255].join('.');
  }

  function calculate(cidrStr) {
    if (!cidrStr || typeof cidrStr !== 'string') return null;
    const parts = cidrStr.trim().split('/');
    const ipStr = parts[0];
    const octets = parseIPv4(ipStr);

    if (!octets) return { error: 'Invalid IPv4 address' };
    if (parts.length > 2 || (parts.length === 2 && !/^(?:[0-9]|[12][0-9]|3[0-2])$/.test(parts[1]))) {
      return { error: 'Invalid CIDR prefix (0-32)' };
    }

    const prefix = parts.length === 2 ? Number(parts[1]) : 24;
    const normalizedIp = octets.join('.');
    const ipInt = ipToInt(normalizedIp);
    const maskInt = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

    const firstUsable = prefix >= 31 ? networkInt : networkInt + 1;
    const lastUsable = prefix >= 31 ? broadcastInt : broadcastInt - 1;

    return {
      ip: normalizedIp,
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
