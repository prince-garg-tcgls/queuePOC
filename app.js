const {createServer} = require("http");
const config = require('./config');
const rabbitMqClass = require('./libs/rabbitMq/rabbitMq');

const rabbitMqObj = new rabbitMqClass();

setImmediate(async () => {
    await rabbitMqObj.init("rabbiMqLogs.txt");
});

setTimeout(() => rabbitMqObj.sendToQueue(1), 1000);

const server = createServer();

server.listen(config.port, () => {
    console.log("server is running on port", config.port);
});