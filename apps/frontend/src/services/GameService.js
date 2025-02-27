import axios from 'axios';

class GameService {
  constructor() {
    this.API_URL = `${process.env.VUE_APP_GAME_SERVICE_HOST}/game`;
  }

  async createGameSession(rows, cols, diamonds) {
    try {
      const response = await axios.post(`${this.API_URL}/create`, {
        rows,
        cols,
        diamonds,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create game session:', error);
      throw error;
    }
  }
}

export default new GameService();
