    /**
     * функция-конструктор для прорисовки таблиц с данными из JSON
     * @param cfg  - конфигурация
     * @constructor - функция-конструктор
     */
    var MyTabl = function(cfg){

        console.log(arguments);
        // проверка на правильность создания экземпляра функции
         if(this instanceof MyTabl === false){
            return new MyTabl(cfg);
         }

        cfg.container = cfg.container || 'body';
        cfg.url = cfg.url || 'http://test.woerr.ru/app/php/table_json.php';

        this.cfg = cfg;

    };

    /**
     * Получение данных из JSON
     * @param limit - количество записей
     * @param page - страница с записями
     * @returns {Promise} - асинхронный запрос для получения данных из JSON
     */
    MyTabl.prototype.getTableData = function (limit, page) {
        var MyTabl = this;
        return new Promise(function(resolve,reject){
            $.ajax({
                type: 'GET',
                url: MyTabl.cfg.url+'?limit='+limit+'&page='+page,
                dataType: "json",
                success: function(data){
                    resolve(data);
                }
            });

        })
    };

    /**
     * Создание строки таблицы с данными
     * @param rowData - данные строки таблицы
     * @param tag - тег ячеек(заголовок(th), простая ячейка(td)) строк таблицы
     * @returns {string} - возврат готовой строки
     */
    MyTabl.prototype.createRow = function(rowData,tag){
        tag = tag || 'td';
        return '<tr><'+tag+'>'+
            rowData.join('</'+tag+'><'+tag+'>')+
            '</'+tag+'></tr>';
    };


    MyTabl.prototype.createBody = function(data){
            var body = '';
        for( var i = 0; i<data.length; i++ ){
            body += this.createRow(data[i]);
        }
            return body;
    };

    /**
     * Создание шапки таблицы
     * @param data - данные с названиями заголовков
     * @returns {string} - готовая шапка таблицы
     */
    MyTabl.prototype.createHead = function(data){
        return this.createRow(data,'th');
    };

    /**
     * Отобразить готовую таблицу в HTML структуре
     */
    MyTabl.prototype.draw = function(){
        var MyTabl = this;
        this.getTable().then(function(table){
            $(MyTabl.cfg.container).append(table);
        });
    };

    /**
     * Готовая таблица в HTML формате
     * @returns {Promise} - возвращение результата в качестве нового Promise
     */
    MyTabl.prototype.getTable = function(){
        var table = '';
        var MyTabl = this;
        return new Promise(function(resolve, reject){
            MyTabl.getTableData(5,4).then(function(data){

                table +='<table>';

                table += '<thead>';
                table += MyTabl.createHead(data.head);
                table += '</thead>';

                table += '<tbody>';
                table += MyTabl.createBody(data.body);
                table += '</tbody>';

                table += '</table>';

                resolve(table);
            });
        });
    };


    var mytable = new MyTabl({
        url: 'http://test.woerr.ru/app/php/table_json.php',
        container: '.mytable'
    });

   mytable.draw();


