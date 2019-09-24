const apiType = {
    Persolis: 0,
    Partena: 1,
}

const appStatus = {
    pending: 1,
    running: 2,
    completed: 3,
}

const status = {
    unknown: 1,
}

const messageType = {
    unknown: 0,
    info: 1,
    warging: 2,
    error: 3,
}

module.exports = {
    apiType,
    status,
    appStatus,
    messageType,
}