# Используем официальный образ Node.js
FROM node:22-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock
COPY package*.json ./

# Устанавливаем зависимости, включая @nestjs/cli как devDependency
RUN yarn install

# Устанавливаем @nestjs/cli локально, если он еще не был добавлен
RUN yarn add @nestjs/cli --dev

# Копируем остальные файлы проекта
COPY . .

# Устанавливаем все зависимости проекта
RUN yarn install

# Выполняем сборку проекта с помощью nest (используем локальную зависимость)
RUN yarn nest build

# Открываем порт, на котором будет работать приложение
EXPOSE 3000

# Команда для запуска приложения
CMD ["yarn", "start:prod"]
