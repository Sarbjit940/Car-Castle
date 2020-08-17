var mysql = require('mysql');

function sqlConnection() {
    var connectionPool  = mysql.createPool({
        host : HOST,
        user : USER,
        password : PASSWORD,
        database: DATABASE,
        port: 3306
    });
    global.connectionPool = connectionPool;
    connectionPool.on("enqueue", function(){console.log("connection  queued")});
    connectionPool.on("dequeue", function(){console.log("connection  dequeued")});
}


global.queryExecutePromissified  = function(statement, parameters) {
    return new Promise ((resolve, reject) => {
        connectionPool.query(statement, parameters, function (err, rows) {
            console.log(this.sql);
            if(err){
                console.error(err);
                return reject(err);
            } 
            resolve(rows);
        });
    });
}

sqlConnection();