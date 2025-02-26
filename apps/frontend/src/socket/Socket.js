import io from 'socket.io-client';

class SocketService {
  constructor(callBack) {
    this.socket = io(process.env.VUE_APP_GAME_SERVICE_HOST); // URL вашего сервера

    this.socket.on('tryJoinGame', ({sessionId, token}) => {
      localStorage.setItem(`gameSession${sessionId}`, token);

      console.log('tryJoinGame: SUCCESS', token);

      callBack();
    });
  }

  tryJoinGame(sessionId) {
    this.socket.emit('tryJoinGame', sessionId);
  }
}

export default SocketService;
