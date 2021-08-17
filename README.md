Все действия выполнять с правами администратора!

1) Установить NodeJS
2) Установить gulp глобально через терминал - npm install --global gulp-cli
3) Создать папку проекта и в ней запустить терминал
4) Создать информационный файл package.json - npm init => ответить на вопросы
5) Установить gulp для проекта - npm install gulp --save-dev
6) Создать файл gulpfile.js, который будет хранить в себе сценарий сборки
7) Создать папку с исходными файлами проекта - #src => fonts, img, scss, js
8) Скопировать в файл gulpfile.js следующий код =>
        function defaultTask(cb) {
            // place code for your default task here
            cb();
        }

        exports.default = defaultTask
9) Протестировать сборку - в терминале gulp
10) При возникновении ошибок, сброс пакетного менеджера - npm cache clean --force =>
    npm i npm -g => Выполнить установку gulp с самого начала (п.1)
11) Удаляем тестовый код