const { createServer } = require("http");
const config = require("../config");
const RabbitMqClass = require("../libs/rabbitMq/rabbitMq");
const { kafkaMqConsumer } = require("../libs/kafka/kafkaMq");

setTimeout(async () => {
  if (process.env["MQ"] === "rabbit") {
    const rabbitMqObj = new RabbitMqClass();
    await rabbitMqObj.init("rabbitMqLogs.txt");
  } else await kafkaMqConsumer("kafkaLogs.txt");
});

const server = createServer();

const brokerInfo = `${process.env["BROKER_URL"]}`;
console.log(brokerInfo.split("\n"));

server.listen(config.port, () => {
  console.log("server is running on port", config.port);
});
