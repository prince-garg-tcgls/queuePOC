const { createServer } = require("http");
const config = require("../config");
const RabbitMqClass = require("../libs/rabbitMq/rabbitMq");
const { monotonicFactory } = require("ulidx");
const { kafkaMqProducer } = require("../libs/kafka/kafkaMq");
const { getRandomSizeString } = require("../libs/common/common");

const ulidGenerator = monotonicFactory();

function getIdBasedOnTimeStamp() {
  return ulidGenerator(1);
}
setInterval(async () => {
  const id = getIdBasedOnTimeStamp();
  const data = getRandomSizeString();
  RabbitMqClass.sendToQueue(id, data);
  await kafkaMqProducer(id, data);
}, 100);

// data streaming case
setInterval(async () => {
  const id = getIdBasedOnTimeStamp();
  const data = getRandomSizeString();

  RabbitMqClass.sendToQueue(id, data);
  await kafkaMqProducer(id, data);
}, 500);

// api call on webhooks
setInterval(async () => {
  const id = getIdBasedOnTimeStamp();
  const data = getRandomSizeString();

  RabbitMqClass.sendToQueue(id);
  await kafkaMqProducer(id, data);
}, 1000);

setInterval(async () => {
  const id = getIdBasedOnTimeStamp();
  const data = getRandomSizeString();

  RabbitMqClass.sendToQueue(id, data);
  await kafkaMqProducer(id, data);
}, 2000);

const server = createServer();

server.listen(config.port, () => {
  console.log("server is running on port", config.port);
});
