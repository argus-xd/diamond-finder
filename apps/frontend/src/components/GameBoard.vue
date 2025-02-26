<template>
  <div class="game-container">
    <div class="game-info">
      <div class="status-panel">
        <div class="status-badge" :class="boardInstance.status">
          {{ getStatusText(boardInstance.status) }}
        </div>
        <div class="player-turn" v-if="boardInstance.status === 'in_progress'">
          <div class="player-indicator" :class="{'active': boardInstance.isPlayerOneTurn}">
            <span class="player-icon">👤</span>
            <span class="player-text">
              Игрок 1
              <span v-if="boardInstance.isPlayerOneTurn" class="current-turn">Ваш ход</span>
            </span>
          </div>
          <div class="player-indicator" :class="{'active': !boardInstance.isPlayerOneTurn}">
            <span class="player-icon">👤</span>
            <span class="player-text">
              Игрок 2
              <span v-if="!boardInstance.isPlayerOneTurn" class="current-turn">Ваш ход</span>
            </span>
          </div>
        </div>
      </div>

      <div class="game-result" v-if="boardInstance.status === 'finished'">
        <div class="result-message" :class="isWinner ? 'winner' : 'loser'">
          <span class="result-icon">{{ isWinner ? '🏆' : '💔' }}</span>
          <h2>{{ isWinner ? 'Поздравляем!' : 'В следующий раз повезёт!' }}</h2>
          <p>{{ isWinner ? 'Вы победили!' : 'Вы проиграли' }}</p>
        </div>
      </div>
    </div>

    <div class="game-board">
      <div v-for="(row, rowIndex) in boardInstance.tiles"
           :key="rowIndex"
           class="row">
        <CellEntity
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          :cell="cell"
          @click="openCell(rowIndex, colIndex)"
        />
      </div>
    </div>

    <div class="game-controls">
      <button class="control-button" @click="$router.push('/')">
        Новая игра
      </button>
    </div>
  </div>
</template>

<script>
import CellEntity from './ItemCell.vue';
import Board from '@/entity/Board';
import socketManager from '@/socket/SocketManager';

export default {
  components: {
    CellEntity,
  },
  data() {
    return {
      board: [],
      boardInstance: {},
    };
  },
  computed: {
    isWinner() {
      return this.boardInstance.winnerToken === this.boardInstance.token;
    },
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        'waiting': 'Ожидание второго игрока',
        'in_progress': 'Игра идёт',
        'finished': 'Игра окончена',
      };
      return statusMap[status] || status;
    },
    openCell(row, col) {
      this.boardInstance.openTile(row, col);
    },
    initializeBoard() {
      const sessionId = this.$route.params.sessionId;
      const token = localStorage.getItem(`gameSession${sessionId}`);

      if (!token) {
        socketManager.tryJoinGame(sessionId);
        socketManager.onTryJoinGame(({ sessionId, token }) => {
          localStorage.setItem(`gameSession${sessionId}`, token);
          this.createBoardInstance(sessionId, token);
        });
        return;
      }

      this.createBoardInstance(sessionId, token);
    },
    createBoardInstance(sessionId, token) {
      this.boardInstance = new Board(
        { rows: this.rows, cols: this.cols, token, sessionId },
        () => this.$forceUpdate(),
      );
      this.board = [];
    },
  },
  mounted() {
    this.initializeBoard();
  },
  beforeUnmount() {
    socketManager.clearListeners();
  },
};
</script>

<style scoped>
.game-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.game-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  color: #000000;
}

.status-badge.waiting {
  background-color: #ffa726;
}

.status-badge.playing {
  background-color: #66bb6a;
}

.status-badge.finished {
  background-color: #7e57c2;
}

.player-turn {
  display: flex;
  gap: 10px;
}

.player-indicator {
  padding: 12px 20px;
  border-radius: 20px;
  background: #e0e0e0;
  opacity: 0.6;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 150px;
}

.player-icon {
  font-size: 1.2em;
}

.player-text {
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
}

.current-turn {
  font-size: 0.8em;
  color: #ffd700;
  font-weight: bold;
  margin-top: 2px;
}

.player-indicator.active {
  background: linear-gradient(135deg, #1976d2, #2196f3);
  color: white;
  opacity: 1;
  box-shadow: 0 2px 8px rgba(33,150,243,0.4);
  transform: scale(1.05);
}

.player-indicator.active .current-turn {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.game-board {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.row {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.game-result {
  text-align: center;
  padding: 20px;
}

.result-message {
  padding: 20px;
  border-radius: 8px;
  animation: fadeIn 0.5s ease-out;
}

.result-message.winner {
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
}

.result-message.loser {
  background: linear-gradient(135deg, #6f3530, #e53935);
  color: white;
}

.result-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}

.game-controls {
  margin-top: 20px;
}

.control-button {
  padding: 12px 24px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.control-button:hover {
  background-color: #1976d2;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
