import io from 'socket.io-client';

class SocketManager {
  constructor() {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }

    this.socket = io(process.env.VUE_APP_GAME_SERVICE_HOST);
    this.setupDefaultListeners();

    SocketManager.instance = this;
    return this;
  }

  setupDefaultListeners() {
    this.socket.on('error', (message) => {
      console.error('Socket Error:', message);
    });

    this.socket.on('debug', (message) => {
      console.warn('Socket Debug:', message);
    });
  }

  onGameUpdate(callback) {
    this.socket.on('gameUpdated', callback);
  }

  onTryJoinGame(callback) {
    this.socket.on('tryJoinGame', callback);
  }

  joinGame(sessionId, token) {
    this.socket.emit('joinGame', { sessionId, token });
  }

  makeMove(move) {
    this.socket.emit('makeMove', move);
  }

  tryJoinGame(sessionId) {
    this.socket.emit('tryJoinGame', sessionId);
  }

  clearListeners() {
    this.socket.removeAllListeners('gameUpdated');
    this.socket.removeAllListeners('tryJoinGame');
  }
}

export default new SocketManager();
