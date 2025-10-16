const amqp = require('amqplib');
const { logger } = require('../utils/logger');

class MessageQueueService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const connectionString = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
      this.connection = await amqp.connect(connectionString);
      
      this.channel = await this.connection.createChannel();
      
      this.connection.on('error', (err) => {
        logger.error('❌ RabbitMQ connection error:', err);
        this.isConnected = false;
      });

      this.connection.on('close', () => {
        logger.warn('⚠️ RabbitMQ connection closed');
        this.isConnected = false;
      });

      this.isConnected = true;
      logger.info('✅ RabbitMQ connected');

      // Setup exchanges and queues
      await this.setupExchanges();
      await this.setupQueues();

    } catch (error) {
      logger.error('❌ RabbitMQ connection failed:', error);
      this.isConnected = false;
    }
  }

  async setupExchanges() {
    const exchanges = [
      { name: 'email', type: 'direct' },
      { name: 'notification', type: 'fanout' },
      { name: 'wms_update', type: 'topic' },
      { name: 'tms_update', type: 'topic' },
      { name: 'accounting_update', type: 'topic' },
      { name: 'hr_update', type: 'topic' }
    ];

    for (const exchange of exchanges) {
      await this.channel.assertExchange(exchange.name, exchange.type, { durable: true });
    }
  }

  async setupQueues() {
    const queues = [
      { name: 'email_queue', exchange: 'email', routingKey: 'email.send' },
      { name: 'notification_queue', exchange: 'notification', routingKey: '' },
      { name: 'wms_queue', exchange: 'wms_update', routingKey: 'wms.*' },
      { name: 'tms_queue', exchange: 'tms_update', routingKey: 'tms.*' },
      { name: 'accounting_queue', exchange: 'accounting_update', routingKey: 'accounting.*' },
      { name: 'hr_queue', exchange: 'hr_update', routingKey: 'hr.*' }
    ];

    for (const queue of queues) {
      await this.channel.assertQueue(queue.name, { durable: true });
      await this.channel.bindQueue(queue.name, queue.exchange, queue.routingKey);
    }
  }

  async publishToExchange(exchange, routingKey, message) {
    if (!this.isConnected || !this.channel) {
      logger.warn('⚠️ RabbitMQ not connected, message not sent');
      return false;
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      const published = this.channel.publish(exchange, routingKey, messageBuffer, {
        persistent: true,
        timestamp: Date.now()
      });

      if (published) {
        logger.info(`📤 Message published to ${exchange}:${routingKey}`);
        return true;
      } else {
        logger.warn('⚠️ Message not published, channel buffer full');
        return false;
      }
    } catch (error) {
      logger.error('❌ Message publish error:', error);
      return false;
    }
  }

  async publishToQueue(queueName, message) {
    if (!this.isConnected || !this.channel) {
      logger.warn('⚠️ RabbitMQ not connected, message not sent');
      return false;
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      const published = this.channel.sendToQueue(queueName, messageBuffer, {
        persistent: true,
        timestamp: Date.now()
      });

      if (published) {
        logger.info(`📤 Message published to queue: ${queueName}`);
        return true;
      } else {
        logger.warn('⚠️ Message not published, channel buffer full');
        return false;
      }
    } catch (error) {
      logger.error('❌ Message publish error:', error);
      return false;
    }
  }

  async consume(queueName, callback) {
    if (!this.isConnected || !this.channel) {
      logger.warn('⚠️ RabbitMQ not connected, cannot consume');
      return false;
    }

    try {
      await this.channel.consume(queueName, (msg) => {
        if (msg) {
          try {
            const message = JSON.parse(msg.content.toString());
            callback(message, msg);
            this.channel.ack(msg);
          } catch (error) {
            logger.error('❌ Message consumption error:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });

      logger.info(`📥 Consumer started for queue: ${queueName}`);
      return true;
    } catch (error) {
      logger.error('❌ Consumer setup error:', error);
      return false;
    }
  }

  async disconnect() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.isConnected = false;
  }
}

const messageQueueService = new MessageQueueService();
messageQueueService.connect();

// Message Types
const MessageTypes = {
  EMAIL: {
    exchange: 'email',
    routingKey: 'email.send'
  },
  NOTIFICATION: {
    exchange: 'notification',
    routingKey: ''
  },
  WMS_UPDATE: {
    exchange: 'wms_update',
    routingKey: 'wms.update'
  },
  TMS_UPDATE: {
    exchange: 'tms_update',
    routingKey: 'tms.update'
  },
  ACCOUNTING_UPDATE: {
    exchange: 'accounting_update',
    routingKey: 'accounting.update'
  },
  HR_UPDATE: {
    exchange: 'hr_update',
    routingKey: 'hr.update'
  }
};

module.exports = { MessageQueueService: messageQueueService, MessageTypes };
