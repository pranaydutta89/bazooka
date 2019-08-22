

class UtilsService {

  encryptClientUrl(gameId, roomId, data) {
    return `${location.origin}/play?game=${gameId}&roomId=${roomId}&data=${JSON.stringify(data)}`;
  }

  randomHexColor() {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }

  getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  }

  generateUniqueBrowserId() {
    return Math.random().toString();
  }
}


export default new UtilsService();