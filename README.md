# To Do List

Pet project

## Стэк технологий:

- SPA выпонлено на React, функциональный подход, использованы хуки
- Навигация между страницами с помощью react-router

Google Firebase:
- Authentication 
- Firestore Database для хранения и получения данных в реальном времени
- Firebase Storage для хранения файлов
- Firebase Hosting  

Сторонние пакеты:
- dayjs для форматирования даты
- react-datepicker для выбора даты
- mui/icons-material для иконок кнопок и чекбоксов
- Less для стилизации приложения

## Функционал:
- Авторизация через Google-аккаунт
- CRUD: Создание, просмотр, редактирование (изменение полей и статуса задачи) и удаление задачи
- Возможность прикрепления файлов к записи
- Поля в задаче: заголовок (обязательное поле), описание, дата завершения, прикрепленные файлы
- Если дата завершения истекла или задача выполнена, это визуально отмечено
- Авторизованный пользователь видит только созданные им задачи

## Результат работы
Приложение на Google Firebase Hosting https://todo-list-c1818.web.app/

## Установка

1. Клонировать или скачать репозиторий

        git clone https://github.com/BerezinKonstantin/todo-list
        cd todo-list

2. Установить необходимые зависимости.

        npm i

3. Запустить приложение в режиме разработки, с хот-релоудом

        npm run start

4. Или запустить приложение в режиме production

        npm run build
        npm run start

Локально приложение будет доступно по адресу http://localhost:3000.

## ToDo
- Прелоадер во время загрузки карточек
- Хранение пользователя в localStorage
