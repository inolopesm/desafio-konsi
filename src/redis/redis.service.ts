import { Injectable } from "@nestjs/common";
import { createClient } from "redis";

@Injectable()
export class RedisService {
  private client?: ReturnType<typeof createClient>;

  async connect(url: string) {
    this.client = createClient({ url });
    await this.client.connect();
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.client) throw new Error("redis not connected");
    if (value === undefined) throw new Error("value cannot be undefined");

    if (ttl) {
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    if (!this.client) throw new Error("redis not connected");
    const value = await this.client.get(key);
    if (value === null) return undefined;
    return JSON.parse(value);
  }
}
