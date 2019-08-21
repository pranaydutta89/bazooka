

class UtilsService{

  encryptClientUrl(gameId,roomId,data){
    return `${location.origin}?game=${gameId}&room=${roomId}&data=${JSON.stringify(data)}`;
  }

  randomHexColor(){
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }
}


export default new UtilsService();