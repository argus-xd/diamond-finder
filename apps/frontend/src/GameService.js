import axios from 'axios';

const API_URL = `${process.env.VUE_APP_GAME_SERVICE_HOST}/game`;

export default {
  async createGameSession(rows, cols, diamonds) {
    const response = await axios.post(`${API_URL}/create`, { rows, cols, diamonds });
    return response.data;
  },

};
