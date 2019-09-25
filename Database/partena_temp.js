const client = require('./client.js');
const constantes = require('../Utility/constante.js');

async function insertError(errorTable, callback) {
    try {
        errorTable.forEach(function(row){
            
        });
        var query = 'INSERT INTO public."LogFiles"("origin", "cliID", "date", "createDate", "status", "fileName") ' +
            "VALUES (" + logFile["origin"] + "," + configInfo.cliID + ",'" + logFile["date"] + "','" + logFile["createDate"] + "'," +
            (logFile["status"] !== undefined ? logFile["status"] : constantes.status.unknown) + ",'" + logFile["fileName"] + "');";
        const { rows } = await client.callQuery(query);
        if (typeof callback === 'function')
            callback(rows);
    } catch (ex) {
        throw ("Error in logFiles.js - insertLogFile : \n" + ex.message);
    }
};

module.exports = {
    loadLogFile,
    insertLogFile
};