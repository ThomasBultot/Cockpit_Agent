const constantes = require('../Utility/constante.js');

async function loadConfig(clientID, apiType, callback) {
    try {
        const { rows } = await client.callQuery('SELECT * FROM public."AgentConfig" WHERE "cliID" = ' + clientID + ' AND "apiType" = ' + apiType + ';');

        if (rows.length > 0) {
            rows.forEach(function (row) {
                var config = new Object();
                config.cliID = rows[0]["cliID"];
                config.apiType = rows[0]["apiType"];
                config.runDate = rows[0]["runDate"];
                config.status = rows[0]["status"];
                config.apiUrl = rows[0]["apiUrl"];
                config.apiUser = rows[0]["apiUser"];
                config.apiPassword = rows[0]["apiPassword"];
                config.guid = rows[0]["guid"];
                callback(config);
            })
        }
    } catch (ex) {
        throw ("Error in agentConfig.js - loadConfig : \n" + ex.message);
    }
};

module.exports = {
    loadConfig
};