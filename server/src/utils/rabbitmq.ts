import { Connection } from 'rabbitmq-client';

let rabbit: Connection | null = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const EXCHANGE_NAME = process.env.RABBITMQ_EXCHANGE_NAME || 'synapse.events';
const EXCHANGE_TYPE =
  (process.env.RABBITMQ_EXCHANGE_TYPE as
    | 'topic'
    | 'direct'
    | 'fanout'
    | undefined) || 'topic';

function getConnection(): Connection {
  if (rabbit) return rabbit;
  rabbit = new Connection(RABBITMQ_URL);
  rabbit.on('error', (err) => {
    console.error('RabbitMQ connection error', err);
  });
  rabbit.on('connection', () => {
    console.log('RabbitMQ connection established');
  });
  return rabbit;
}

export type EventPayload<T extends string, D = any> = {
  type: T; // routing key e.g. 'user.follow'
  data: D;
  timestamp?: string;
};

export async function publishEvent<T extends string, D = any>(
  event: EventPayload<T, D>
): Promise<void> {
  const conn = getConnection();
  const pub = conn.createPublisher({
    confirm: true,
    maxAttempts: 3,
    exchanges: [{ exchange: EXCHANGE_NAME, type: EXCHANGE_TYPE }],
  });
  await pub.send(
    { exchange: EXCHANGE_NAME, routingKey: event.type },
    { ...event, timestamp: event.timestamp || new Date().toISOString() }
  );
  await pub.close();
}

export async function closeRabbit(): Promise<void> {
  try {
    await rabbit?.close();
  } catch {}
  rabbit = null;
}
