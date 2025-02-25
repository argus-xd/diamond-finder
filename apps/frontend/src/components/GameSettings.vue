<template>
  <div class="settings">
    <h2>Выберите размер поля</h2>
    <label>
      Ширина: {{ width }}
      <input type="range" v-model="width" min="3" max="7" step="1" />
    </label>
    <label>
      Высота: {{ height }}
      <input type="range" v-model="height" min="3" max="7" step="1" />
    </label>
    <label>
      Кристаллы: {{ diamonds }}
      <input type="range" v-model="diamonds" min="4" max="15" step="1" />
    </label>
    <button @click="startGame">Начать игру</button>
  </div>
</template>

<script>
import GameService from '@/GameService';

export default {
  data() {
    return {
      width: 5,
      height: 5,
      diamonds: 5
    };
  },
  methods: {
    async startGame() {
      try {
        const gameSession = await GameService.createGameSession(this.width, this.height, this.diamonds);
        console.log('Game session created:', gameSession);

        // Сохранение токена в localStorage
        localStorage.setItem(`gameSession${gameSession.id}`, gameSession.token);

        // Перенаправление на страницу игры
        this.$router.push(`/game/${gameSession.id}`);
      } catch (error) {
        console.error('Error creating game session:', error);
      }
    }
  }
};
</script>
