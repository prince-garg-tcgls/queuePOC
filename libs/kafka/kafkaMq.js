const kafkaJs = require("kafkajs");
const { entryForTheData, getRandomSizeString } = require("../common/common");
const { filesize } = require("filesize");

const TOPIC_ID = "dataqueue";
const GROUP_ID = "group-id";

const init = (clientId = "consumer") => {
  const brokers = `${process.env["BROKER_URL"]}`
    .split("\n")
    .filter((broker) => broker.length > 0);
  return new kafkaJs.Kafka({
    clientId,
    brokers,
  });
};

const kafkaMqConsumer = async (filename = "kafkaLogs.txt") => {
  try {
    const client = init("consumer");
    const consumer = client.consumer({
      groupId: GROUP_ID,
    });

    await consumer.connect();

    await consumer.subscribe({
      topic: TOPIC_ID,
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: ({ topic, partition, message }) => {
        console.log(topic);
        console.log(partition);
        const logMsg = `${new Date().toISOString()} - ${filesize(message.value.toString().length)} - ${message.key.toString()}\n`;
        console.log(filesize(message.value.toString().length));
        entryForTheData(logMsg, filename);
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const kafkaMqProducer = async (id) => {
  try {
    const client = init("consumer");
    const producer = client.producer();
    await producer.connect();
    console.log("producer connection complete");

    await producer.send({
      topic: TOPIC_ID,
      messages: [
        {
          key: id,
          value: getRandomSizeString(),
        },
      ],
    });
    console.log("producer sent data");

    await producer.disconnect();
  } catch (error) {
    console.error("errr", error);
    entryForTheData(`err from producer ${error}`);
  }
};

module.exports = {
  kafkaMqConsumer,
  kafkaMqProducer,
};
