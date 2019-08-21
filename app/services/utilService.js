

class UtilsService{

  encryptClientUrl(gameId,roomId,data){
    return `${location.origin}?game=${gameId}&room=${roomId}&data=${JSON.stringify(data)}`;
  }

}


export default new UtilsService();