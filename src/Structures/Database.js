const sql = require(`mysql2`);
const config = require(`../config.json`);

let connection = sql.createConnection({
    host: config.db.host,
    user: config.db.username,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,
});

module.exports = {

    async startDatabase() {

        await connection.connect((err) => {
            if(err){
                console.log(err);
                console.log(`Database connection failed.`)
                return; 
            } 

            console.log(`Database Successfully Connected.`);
        });
    },

}

module.exports.db = connection;