<template>
  <div class="settings">
    <div class="settings-card">
      <h2>Настройки игры</h2>
      
      <div class="setting-group">
        <label>
          Ширина поля: {{ width }}
          <input 
            type="range" 
            v-model.number="width" 
            :min="BOARD_LIMITS.MIN_SIZE" 
            :max="BOARD_LIMITS.MAX_SIZE" 
            step="1" 
          />
        </label>
      </div>

      <div class="setting-group">
        <label>
          Высота поля: {{ height }}
          <input 
            type="range" 
            v-model.number="height" 
            :min="BOARD_LIMITS.MIN_SIZE" 
            :max="BOARD_LIMITS.MAX_SIZE" 
            step="1" 
          />
        </label>
      </div>

      <div class="setting-group">
        <label>
          Кристаллы: {{ diamonds }}
          <input 
            type="range" 
            v-model.number="diamonds" 
            :min="DIAMOND_LIMITS.MIN" 
            :max="DIAMOND_LIMITS.MAX" 
            step="1" 
          />
        </label>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <button 
        @click="startGame" 
        :disabled="isLoading"
      >
        {{ isLoading ? 'Создание...' : 'Начать игру' }}
      </button>
    </div>
  </div>
</template>

<script>
import GameService from '@/GameService';

const BOARD_LIMITS = {
  MIN_SIZE: 3,
  MAX_SIZE: 7
};

const DIAMOND_LIMITS = {
  MIN: 4,
  MAX: 15
};

export default {
  data() {
    return {
      width: 5,
      height: 5,
      diamonds: 5,
      error: null,
      isLoading: false,
      BOARD_LIMITS,
      DIAMOND_LIMITS
    };
  },
  methods: {
    async startGame() {
      this.error = null;
      this.isLoading = true;
      
      try {
        const gameSession = await GameService.createGameSession(
          this.width, 
          this.height, 
          this.diamonds
        );
        localStorage.setItem(`gameSession${gameSession.id}`, gameSession.token);
        this.$router.push(`/game/${gameSession.id}`);
      } catch (error) {
        this.error = 'Не удалось создать игру';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.settings {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
}

.settings-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.setting-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

input[type="range"] {
  width: 100%;
  margin: 10px 0;
}

button {
  width: 100%;
  padding: 10px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
}

.error {
  color: red;
  margin: 10px 0;
  text-align: center;
}
</style>
