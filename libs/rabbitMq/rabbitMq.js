const amqp = require("amqplib");
const {filesize} = require('filesize');

const {getRandomSizeString, entryForTheData} = require("./../common/common");
const config = require("./../../config");

class SetupRabbitMq {

    constructor(channel) {}

    async init(filename) {
        try {
            const connection = await amqp.connect(config.amqpServerString);

            this.channel = await connection.createChannel();
        
            await this.channel.assertQueue("data-queue");

            // Consume previously sent data from RabbitMQ & acknowledge the transaction
            this.channel.consume("data-queue", (data) => {
                try {
                    console.log("Consumed from data-queue");

                    entryForTheData(`${(new Date()).toISOString()} - ${filesize(data.content.toString().length)} - ${(data.content.toString().split(" "))[1]}\n`, filename);

                    console.log("data", filesize(data.content.toString().length));

                    this.channel.ack(data);
                }
                catch(err) {
                    console.log("err in consume", err);
                }
            });
        }
        catch(err) {
            console.log("error in init");
            throw err;
        }
    }

    sendToQueue(counter) {
        try {
            // Send data to RabbitMQ queue
            this.channel.sendToQueue(
                "data-queue",
                Buffer.from(getRandomSizeString() + " " + counter)
            );
        }
        catch(err) {
            console.log("error in sendToQueue");
            throw err;
        }
    }
}

module.exports = SetupRabbitMq;