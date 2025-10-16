import amqp from 'amqplib';
import { logger } from '@/utils/logger';

let connection: amqp.Connection;
let channel: amqp.Channel;

export async function connectRabbitMQ(): Promise<void> {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://ayaz_user:ayaz_password@localhost:5672';
    
    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    connection.on('error', (err) => {
      logger.error('RabbitMQ Connection Error:', err);
    });

    connection.on('close', () => {
      logger.warn('RabbitMQ Connection Closed');
    });

    // Declare exchanges
    await channel.assertExchange('ayaz.notifications', 'topic', { durable: true });
    await channel.assertExchange('ayaz.workflow', 'topic', { durable: true });
    await channel.assertExchange('ayaz.integration', 'topic', { durable: true });

    // Declare queues
    const queues = [
      'email.queue',
      'sms.queue',
      'notification.queue',
      'invoice.queue',
      'wms.queue',
      'tms.queue',
      'hr.queue',
      'audit.queue'
    ];

    for (const queueName of queues) {
      await channel.assertQueue(queueName, { durable: true });
    }

    logger.info('RabbitMQ connected successfully');
  } catch (error) {
    logger.error('RabbitMQ connection failed:', error);
    throw error;
  }
}

export async function disconnectRabbitMQ(): Promise<void> {
  try {
    if (channel) {
      await channel.close();
    }
    if (connection) {
      await connection.close();
    }
    logger.info('RabbitMQ connection closed');
  } catch (error) {
    logger.error('Error closing RabbitMQ connection:', error);
    throw error;
  }
}

// Message Queue Service
export class MessageQueueService {
  static async publishToExchange(exchange: string, routingKey: string, message: any): Promise<void> {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      await channel.publish(exchange, routingKey, messageBuffer, {
        persistent: true,
        timestamp: Date.now()
      });
      logger.info(`Message published to ${exchange} with routing key ${routingKey}`);
    } catch (error) {
      logger.error('Error publishing message:', error);
      throw error;
    }
  }

  static async publishToQueue(queueName: string, message: any): Promise<void> {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      await channel.sendToQueue(queueName, messageBuffer, {
        persistent: true,
        timestamp: Date.now()
      });
      logger.info(`Message sent to queue ${queueName}`);
    } catch (error) {
      logger.error('Error sending message to queue:', error);
      throw error;
    }
  }

  static async consumeQueue(queueName: string, callback: (message: any) => Promise<void>): Promise<void> {
    try {
      await channel.consume(queueName, async (msg) => {
        if (msg) {
          try {
            const message = JSON.parse(msg.content.toString());
            await callback(message);
            channel.ack(msg);
          } catch (error) {
            logger.error(`Error processing message from ${queueName}:`, error);
            channel.nack(msg, false, false); // Don't requeue
          }
        }
      });
      logger.info(`Started consuming queue ${queueName}`);
    } catch (error) {
      logger.error(`Error setting up consumer for queue ${queueName}:`, error);
      throw error;
    }
  }

  static async bindQueueToExchange(queueName: string, exchange: string, routingKey: string): Promise<void> {
    try {
      await channel.bindQueue(queueName, exchange, routingKey);
      logger.info(`Queue ${queueName} bound to exchange ${exchange} with routing key ${routingKey}`);
    } catch (error) {
      logger.error('Error binding queue to exchange:', error);
      throw error;
    }
  }
}

// Predefined message types
export const MessageTypes = {
  EMAIL: {
    exchange: 'ayaz.notifications',
    routingKey: 'email.send'
  },
  SMS: {
    exchange: 'ayaz.notifications',
    routingKey: 'sms.send'
  },
  NOTIFICATION: {
    exchange: 'ayaz.notifications',
    routingKey: 'notification.push'
  },
  INVOICE: {
    exchange: 'ayaz.workflow',
    routingKey: 'invoice.generate'
  },
  WMS_UPDATE: {
    exchange: 'ayaz.workflow',
    routingKey: 'wms.update'
  },
  TMS_UPDATE: {
    exchange: 'ayaz.workflow',
    routingKey: 'tms.update'
  },
  AUDIT_LOG: {
    exchange: 'ayaz.integration',
    routingKey: 'audit.log'
  }
};
