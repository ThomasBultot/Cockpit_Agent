var request = require('request');
const dblogFiles = require('../Database/logFiles.js');

/*
*  Retrieve the list of erp files which have been send to Partena.
*  As decided, only the last file will be process.
*  This function is calling the getErrors function to process the errors attached to the file.
*/
function getLogs() {
    try {
        var uri = configInfo.apiUrl + "timestamp";
        var autho = "Basic " + getAuthorization();
        request({
            headers: {
                'Authorization': autho,
            },
            uri: uri,
        },
            function (error, response, body) {
                if (response.statusCode != 200) {
                    throw new Error("An error has occured during the call to the api. Url: " + uri + " / status code: " + response.statusCode);
                }
                var results = JSON.parse(body);
                if (results.length > 0) {
                    /* Only the last file is processed */
                    var fileResult = results[0];
                    /*  Check if the file already exists.
                        else create a new record */
                    dblogFiles.loadLogFile(fileResult.talend.fileName, constantes.apiType.Partena,
                        function (result) {
                            var logFile = new Object();
                            /* No file found, we create it */
                            if (result.length == 0) {
                                logFile["origin"] = constantes.apiType.Partena;
                                logFile["cliID"] = configInfo.cliID;
                                logFile["fileName"] = fileResult.talend.fileName;
                                logFile["createDate"] = new Date().toISOString();
                                logFile["date"] = fileResult.talend.fileDate;
                                logFile["status"] = constantes.status.unknown;
                                dblogFiles.insertLogFile(logFile, function (result) {
                                    logFile = result[0];
                                });
                            }
                            /* Only one file should exist with the same name for the same client */
                            else {
                                logFile = result[0];
                            }
                            getErrors(logFile);
                        }
                    );
                }
            })
    } catch (ex) {
        throw ("Error in partena.js - getLog : \n" + ex.message);
    }
};

function getErrors(logFile) {
    try {
        var uri = configInfo.apiUrl + "log?fileName=" + logFile["fileName"];
        var autho = "Basic " + getAuthorization();
        request({
            headers: {
                'Authorization': autho,
            },
            uri: uri,
        },
            function (error, response, body) {
                if (response.statusCode != 200) {
                    throw new Error("An error has occured during the call to the api. Url: " + uri + " / status code: " + response.statusCode);
                }
                var results = JSON.parse(body);
                var errorTable = [];
                results.forEach(function (result) {
                    var errorRow = new Object();
                    errorRow["cliID"] = configInfo.cliID;
                    errorRow["logID"] = logFile["logID"];
                    errorRow["messageType"] = translateMessageType(result.messageType);
                    errorRow["messageType"] = translateMessageType(result.messageType);
                    errorRow["createDate"] = new Date().toISOString();
                    errorRow["updateDate"] = new Date().toISOString();
                    errorTable.push(errorRow);
                    console.log(result);
                });
            })
    } catch (ex) {
        throw ("Error in partena.js - getErrors : \n" + ex.message);
    }
};

/* 
*Partena is sending a messageType. As the value is a plain text
                   *  we should translate it as internal enum for futher traitment.
                   */
function translateMessageType(messageType) {
    if (messageType === 'Information Message') {
        return constantes.messageType.info;
    } else if (messageType === 'Errro Message') {
        return constantes.messageType.error;
    } else {
        return constantes.messageType.unknown;
    }
}

/*
*  This function return the encoded string for the authentification.
*  It use the user and password stored in the global configIno and return the string in base64
*/
function getAuthorization() {
    return Buffer.from(configInfo.apiUser + ':' + configInfo.apiPassword).toString('base64');
}

module.exports = {
    getLogs
};