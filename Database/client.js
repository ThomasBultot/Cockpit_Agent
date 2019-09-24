const config = require('../Config/config.js');
var hello = 'coucou';
const { Pool } = require('pg');
const pool = new Pool({
    user: config.db_user,
    password: config.db_password,
    host: config.db_host,
    port: config.db_port,
    database: config.db_name
});

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (ex, client) => {
    console.error('Unexpected error on idle client', ex)
    process.exit(-1)
  })

async function callQuery(query) {
    try {
        var resultTable = await pool.query(query);
        return resultTable;
    } catch (ex) {
        throw new Error("callQuery : \n" + query + "\n" + ex);
    }
}

function disconnect(){
    try{
        pool.end();
    }catch(ex){
        throw new Error("disconnect pool : \n" + ex);
    }
}

module.exports = {
    callQuery,
    disconnect
};