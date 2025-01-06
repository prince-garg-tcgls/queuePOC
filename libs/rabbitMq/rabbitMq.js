const amqp = require("amqplib");
const { filesize } = require("filesize");

const { entryForTheData } = require("./../common/common");

class SetupRabbitMq {
  constructor(channel) {
    this.channel = channel;
  }

  async init(filename) {
    try {
      const connection = await amqp.connect(process.env["MQ_URL"]);

      this.channel = await connection.createChannel();

      await this.channel.assertQueue("data-queue", {durable: true});

      // Consume previously sent data from RabbitMQ & acknowledge the transaction
      this.channel.consume("data-queue", (data) => {
        try {
          console.log("Consumed from data-queue");

          entryForTheData(
            `${new Date().toISOString()} - ${filesize(data.content.toString().length)} - ${data.content.toString().split(" ")[1]}\n`,
            filename,
          );

          console.log("data", filesize(data.content.toString().length));

          this.channel.ack(data);
        } catch (err) {
          console.log("err in consume", err);
        }
      }, {noAck: false});
    } catch (err) {
      console.log("error in init");
      console.log(err);
    }
  }

  static async sendToQueue(counter, data) {
    try {
      const start = Date.now();
      const connection = await amqp.connect(process.env["MQ_URL"]);

      console.log("adding send to mq");

      const channel = await connection.createChannel();
      await channel.assertQueue("data-queue");
      // Send data to RabbitMQ queue
      channel.sendToQueue(
        "data-queue",
        Buffer.from(data + " " + counter),
        undefined,
      );
      await channel.close();
      await connection.close();
      console.log("BENCHMARK FOR PRODUCER [RABBIT]", Date.now() - start);
    } catch (err) {
      entryForTheData(`error in sendQueue ${err}`, "rabbit-errors.txt");
      console.log("error in sendToQueue", err);
    }
  }
}

module.exports = SetupRabbitMq;
