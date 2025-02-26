# diamond-finder

## Начало работы

Для начала работы с проектом выполните следующие шаги:

### 1. Запуск контейнера PostgreSQL

Для запуска контейнера PostgreSQL с нужной конфигурацией используйте команду:

```bash
docker run --name postgres-game \
  -e POSTGRES_USER=game_user \
  -e POSTGRES_PASSWORD=game_password \
  -e POSTGRES_DB=game_db \
  -p 5432:5432 \
  -d postgres

```
Эта команда создаст контейнер с именем postgres-game, установит пользователя game_user, пароль game_password и базу данных game_db. Контейнер будет слушать порт 5432 на хосте и работать в фоновом режиме.

2. Генерация миграций и сборка бэкенда
После того как контейнер PostgreSQL будет запущен, необходимо создать и применить миграции, а также собрать бэкенд. Для этого выполните следующие шаги:

# Генерация миграций
__yarn run start:migration:generate__

Эта команда сгенерирует миграции, если они еще не были созданы.

# Сборка бэкенда
`yarn run build:backend`

После этого соберите бэкенд для запуска, скомпилировав все необходимые файлы.

# Применение миграций
`yarn run start:migration:run`

Примените все миграции к базе данных, чтобы структура базы данных была актуальной и соответствовала проекту.

3. Запуск бэкенда и фронтенда
После того как все миграции были применены и бэкенд собран, запустите сервер бэкенда и фронтенда:

# Запуск бэкенда
`yarn run start:backend`

Эта команда запустит сервер бэкенда, который будет обрабатывать запросы и взаимодействовать с базой данных.

# Запуск фронтенда
`yarn run start:frontend`

Запустит сервер фронтенда, который будет обслуживать клиентскую часть проекта. Убедитесь, что ваши настройки фронтенда правильно связаны с сервером бэкенда.

перейти на http://localhost:8080/

можно отредактировать `.env` файл в корне каждого проекта

# TODO
Закончить с Docker файлом для фронта
