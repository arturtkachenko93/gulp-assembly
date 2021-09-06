#Все действия выполнять с правами администратора!

:white_check_mark: Установить NodeJS arrow_right: [NODEJS]https://nodejs.org/en/ LTS версию
:white_check_mark: Установить gulp глобально через терминал (устанавливается один раз на ПК) arrow_right: npm install --global gulp-cli
Если же gulp установлен, то обновить arrow_right:
    npm rm --global gulp
:white_check_mark: Создать папку проекта и в ней запустить терминал
:white_check_mark: Создать информационный файл package.json arrow_right: npm init / ответить на вопросы
:white_check_mark: Установить gulp для проекта arrow_right: npm install gulp --save-dev
:white_check_mark: Создать файл gulpfile.js для настройки задач и сборки
:white_check_mark: Создать папку с исходными файлами проекта arrow_right: source / fonts, img, scss, js
:white_check_mark: Скопировать в файл gulpfile.js следующий код arrow_right:
        ```function defaultTask(cb) {
            // place code for your default task here
            cb();
        }
        exports.default = defaultTask
        ```
:white_check_mark: Протестировать сборку arrow_right: gulp в терминале
:exclamation: При возникновении ошибок, сброс пакетного менеджера arrow_right: npm cache clean --force / npm i npm -g arrow_right: Выполнить установку gulp с самого начала (п.1)
:white_check_mark: Удалить тестовый код
