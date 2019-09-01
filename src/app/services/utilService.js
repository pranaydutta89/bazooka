class UtilsService {
  hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  randomIntFromInterval(min, max, exceptNumbers) {
    const rndNum = Math.floor(Math.random() * (max - min + 1) + min);
    if (exceptNumbers && exceptNumbers.some(r => r === rndNum)) {
      return this.randomIntFromInterval(min, max, exceptNumbers);
    }
    return rndNum;
  }

  intToARGB(i) {
    var hex =
      ((i >> 24) & 0xff).toString(16) +
      ((i >> 16) & 0xff).toString(16) +
      ((i >> 8) & 0xff).toString(16) +
      (i & 0xff).toString(16);
    hex += '000000';
    return hex.substring(0, 6);
  }

  pickColor(str) {
    const hex = this.intToARGB(this.hashCode(str));
    return '#' + hex;
  }

  getQueryStringValue(key) {
    return decodeURIComponent(
      location.hash.replace(
        new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'),
        '$1'
      )
    );
  }

  generateUniqueBrowserId() {
    return Math.random().toString();
  }
}

export default new UtilsService();
