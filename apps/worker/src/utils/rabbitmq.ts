import { Connection } from 'rabbitmq-client';

export async function createConsumer(
  opts?: {
    url?: string;
    exchange?: string;
    queue?: string;
    bindingKeys?: string[];
  },
  handler?: (msg: any) => Promise<void>
) {
  const url = opts?.url || process.env.RABBITMQ_URL!;
  const exchange = opts?.exchange || process.env.RABBITMQ_EXCHANGE_NAME!;
  const queue = opts?.queue || process.env.RABBITMQ_QUEUE!;
  const bindingKeys = opts?.bindingKeys || [];

  const rabbit = new Connection(url);
  rabbit.on('error', (err: unknown) => console.error('RabbitMQ error', err));
  rabbit.on('connection', () => console.log('RabbitMQ connected (worker)'));

  // createConsumer will declare exchange/queue/bindings, handle QoS, and auto-reconnect
  const consumer = rabbit.createConsumer(
    {
      queue,
      queueOptions: { durable: true },
      qos: { prefetchCount: 10 },
      exchanges: [
        {
          exchange,
          type: (process.env.RABBITMQ_EXCHANGE_TYPE as any) || 'topic',
        },
      ],
      queueBindings: bindingKeys.map((routingKey) => ({
        exchange,
        routingKey,
      })),
    },
    async (msg: any) => {
      if (handler) {
        await handler(msg);
      }
    }
  );

  return { rabbit, consumer };
}
