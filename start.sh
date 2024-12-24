docker-compose up -d --build controller-1 controller-2 controller-3 broker-1 broker-2 broker-3 rabbitmq
sleep 15
docker-compose up -d --build kafka-consumer rabbit-consumer producer
