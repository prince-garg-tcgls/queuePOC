const { createServer } = require("http");
const config = require("../config");
const RabbitMqClass = require("../libs/rabbitMq/rabbitMq");
const { monotonicFactory } = require("ulidx");
const { kafkaMqProducer } = require("../libs/kafka/kafkaMq");

const ulidGenerator = monotonicFactory();

function getIdBasedOnTimeStamp() {
  return ulidGenerator(1);
}
setInterval(async () => {
  const id = getIdBasedOnTimeStamp();
  RabbitMqClass.sendToQueue(id);
  await kafkaMqProducer(id);
}, 100);

// data streaming case
setInterval(async () => {
  const id = getIdBasedOnTimeStamp();
  RabbitMqClass.sendToQueue(id);
  await kafkaMqProducer(id);
}, 500);

// api call on webhooks
setInterval(async () => {
  const id = getIdBasedOnTimeStamp();
  RabbitMqClass.sendToQueue(id);
  await kafkaMqProducer(id);
}, 1000);

setInterval(async () => {
  const id = getIdBasedOnTimeStamp();
  RabbitMqClass.sendToQueue(id);
  await kafkaMqProducer(id);
}, 2000);

const server = createServer();

server.listen(config.port, () => {
  console.log("server is running on port", config.port);
});
