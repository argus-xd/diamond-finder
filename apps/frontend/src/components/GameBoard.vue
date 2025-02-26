<template>
  <div class="game-board">
    <div>Game status: {{ boardInstance.status }}</div>
    <div>Ходит {{ boardInstance.isPlayerOneTurn? 1:2 }} игрок</div>
    <h1 v-if="boardInstance.status === 'finished'">
      {{ boardInstance.winnerToken === boardInstance.token ? 'Вы победили' : 'Вы проиграли' }}
    </h1>
    <div v-for="(row, rowIndex) in this.boardInstance.tiles" :key="rowIndex" class="row">
      <CellEntity v-for="(cell, colIndex) in row" :key="colIndex" :cell="cell" @click="openCell(rowIndex, colIndex)" />
    </div>
  </div>
</template>

<script>
import CellEntity from './ItemCell.vue';
import Board from '@/entity/Board';
import SocketService from '@/socket/Socket';

export default {
  components: {
    CellEntity: CellEntity,
  },
  data() {
    return {
      board: [],
      boardInstance: {},
      socket: new SocketService(this.initializeBoard),
    };
  },
  methods: {
    openCell(row, col) {
      this.boardInstance.openTile(row, col);
    },
    initializeBoard() {
      console.log('Размер поля:', this.rows, 'x', this.cols);

      // Получаем sessionId из параметров маршрута
      const sessionId = this.$route.params.sessionId;

      // Получаем токен из localStorage
      const token = localStorage.getItem(`gameSession${sessionId}`);
      if (!token) {
        // Попытка получить токен
        this.socket.tryJoinGame(sessionId);
        return;
      }

      this.boardInstance = new Board({rows: this.rows, cols: this.cols, token, sessionId}, () => {
        this.$forceUpdate(); // Принудительное обновление компонента
      });
      this.board = [];
    },
  },
  mounted() {
    this.initializeBoard();
  },

};
</script>

<style scoped>

.game-board {
  //background: darkgrey;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.row {
  display: flex;
}
</style>
