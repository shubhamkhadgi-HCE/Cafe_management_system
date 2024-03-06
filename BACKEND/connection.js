require('dotenv').config();
const mysql = require('mysql');

const DB_CONFIG = {
    port     : process.env.DB_PORT,
    host     : process.env.DB_HOST,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
}

var conn = mysql.createConnection(DB_CONFIG);

conn.connect((err) => {
    if (!err) {
        console.log("Connected...");    
    } else {        
        console.log(err);
    }
});


module.export = conn;