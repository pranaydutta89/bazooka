const utils = require('./utils');

const staticData = {
  clientUrlData: {}
};

module.exports = {
  encryptClientUrl: gameData => {
    const rndStr = utils.randomString();
    staticData.clientUrlData[rndStr] = gameData;
    return rndStr;
  },
  decryptClientUrl: id => {
    return staticData.clientUrlData[id];
  }
};
