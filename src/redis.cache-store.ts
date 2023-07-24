import { CacheStore, CacheStoreSetOptions } from "@nestjs/cache-manager";
import { createClient } from "redis";

export class RedisCacheStore implements CacheStore {
  private client?: ReturnType<typeof createClient>;

  async connect(url: string) {
    this.client = createClient({ url });
    await this.client.connect();
  }

  async set<T>(
    key: string,
    value: T,
    options?: number | CacheStoreSetOptions<T> | undefined
  ): Promise<void> {
    if (!this.client) throw new Error("redis not connected");
    if (value === undefined) throw new Error("value cannot be undefined");

    let ttl: number | undefined;

    if (typeof options === "number") {
      ttl = options;
    } else if (options?.ttl !== undefined) {
      if (typeof options.ttl === "number") {
        ttl = options.ttl;
      } else {
        ttl = options.ttl(value);
      }
    }

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

  async del(key: string): Promise<void> {
    if (!this.client) throw new Error("redis not connected");
    await this.client.del(key);
  }
}
