import { createRouter, createWebHistory } from 'vue-router';
import GameBoard from '@/components/GameBoard.vue';
import GameSettings from '@/components/GameSettings.vue';

const routes = [
  {
    path: '/',
    component: GameSettings,
  },
  {
    path: '/game/:sessionId',
    component: GameBoard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
