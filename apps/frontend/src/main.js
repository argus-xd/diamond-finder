import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Импортируем маршрутизатор

// Создаем экземпляр приложения Vue
const app = createApp(App);

// Подключаем маршрутизатор к приложению
app.use(router);

// Монтируем приложение в DOM
app.mount('#app');

