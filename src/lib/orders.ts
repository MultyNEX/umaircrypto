import { getRedis } from "./redis";

export interface Order {
  refId: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  amount: string;
  network: string;
  txHash: string;
  thumbnail: string; // base64 data URL
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO timestamp
  resolvedAt?: string; // ISO timestamp when approved/rejected
}

const INDEX_KEY = "order_ids";

export async function saveOrder(order: Order): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(`order:${order.refId}`, JSON.stringify(order));
  await redis.lpush(INDEX_KEY, order.refId);
}

export async function getOrder(refId: string): Promise<Order | null> {
  const redis = getRedis();
  if (!redis) return null;
  const data = await redis.get<string>(`order:${refId}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : (data as unknown as Order);
}

export async function getAllOrders(): Promise<Order[]> {
  const redis = getRedis();
  if (!redis) return [];
  const ids = await redis.lrange(INDEX_KEY, 0, -1);
  if (!ids || ids.length === 0) return [];

  const orders: Order[] = [];
  // Fetch in batches using pipeline
  const pipeline = redis.pipeline();
  for (const id of ids) {
    pipeline.get(`order:${id}`);
  }
  const results = await pipeline.exec();

  for (const raw of results) {
    if (!raw) continue;
    try {
      const order = typeof raw === "string" ? JSON.parse(raw) : (raw as unknown as Order);
      if (order && order.refId) orders.push(order);
    } catch {
      // skip corrupted entries
    }
  }

  return orders;
}

export async function updateOrderStatus(
  refId: string,
  status: "approved" | "rejected"
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const order = await getOrder(refId);
  if (!order) return;
  order.status = status;
  order.resolvedAt = new Date().toISOString();
  await redis.set(`order:${order.refId}`, JSON.stringify(order));
}
