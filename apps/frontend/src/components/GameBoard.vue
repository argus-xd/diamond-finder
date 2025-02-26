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
import socketManager from '@/socket/SocketManager';

export default {
  components: {
    CellEntity: CellEntity,
  },
  data() {
    return {
      board: [],
      boardInstance: {},
    };
  },
  methods: {
    openCell(row, col) {
      this.boardInstance.openTile(row, col);
    },
    initializeBoard() {
      console.log('Размер поля:', this.rows, 'x', this.cols);

      const sessionId = this.$route.params.sessionId;
      const token = localStorage.getItem(`gameSession${sessionId}`);

      if (!token) {
        socketManager.tryJoinGame(sessionId);

        socketManager.onTryJoinGame(({sessionId, token}) => {
          localStorage.setItem(`gameSession${sessionId}`, token);
          console.log('tryJoinGame: SUCCESS', token);
          this.createBoardInstance(sessionId, token);
        });
        return;
      }

      this.createBoardInstance(sessionId, token);
    },
    createBoardInstance(sessionId, token) {
      this.boardInstance = new Board(
        { rows: this.rows, cols: this.cols, token, sessionId },
        () => this.$forceUpdate()
      );
      this.board = [];
    }
  },
  mounted() {
    this.initializeBoard();
  },
  beforeUnmount() {
    socketManager.clearListeners();
  }

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
