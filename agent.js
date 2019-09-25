const agentConfig = require('./Database/agentConfig.js');
const error = require('./Utility/error.js');
global.client = require('./Database/client.js');
global.constantes = require('./Utility/constante.js');
global.configInfo = new Object();

try {
    agentConfig.loadConfig("1", constantes.apiType.Partena, function (config) {
        configInfo = config;
        if (config.apiType == constantes.apiType.Partena) {
            const partena = require('./API/partena.js');
            partena.getLogs();
        }
    });
} catch (ex) {
    client.disconnect();
    error.logError(ex.message);



}