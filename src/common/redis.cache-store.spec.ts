import * as redis from "redis";
import { RedisCacheStore } from "./redis.cache-store";

jest.mock("redis");

describe("RedisCacheStore", () => {
  describe("connect", () => {
    it("should connect with redis with correct url", async () => {
      const redisCacheStore = new RedisCacheStore();
      const createSpy = jest.spyOn(redis, "createClient");
      const redisClient = { connect: jest.fn() };
      type RedisClient = ReturnType<typeof redis.createClient>;
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      const url = "redis://localhost";
      await redisCacheStore.connect(url);
      expect(createSpy).toHaveBeenCalledWith({ url });
      expect(redisClient.connect).toHaveBeenCalled();
    });
  });

  describe("set", () => {
    it("should throw error if client is not connected", async () => {
      const redisCacheStore = new RedisCacheStore();
      const promise = redisCacheStore.set("key", "value");
      const error = new Error("redis not connected");
      await expect(promise).rejects.toThrow(error);
    });

    it("should throw error if value is undefined", async () => {
      const redisCacheStore = new RedisCacheStore();
      const createSpy = jest.spyOn(redis, "createClient");
      const redisClient = { connect: async () => {} };
      type RedisClient = ReturnType<typeof redis.createClient>;
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisCacheStore.connect("redis://localhost");
      const promise = redisCacheStore.set("key", undefined);
      const error = new Error("value cannot be undefined");
      await expect(promise).rejects.toThrow(error);
    });

    it("should set to redis with correct key-value", async () => {
      const redisCacheStore = new RedisCacheStore();
      const createSpy = jest.spyOn(redis, "createClient");
      const redisClient = { connect: async () => {}, set: jest.fn() };
      type RedisClient = ReturnType<typeof redis.createClient>;
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisCacheStore.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      const value = { number: Math.random() };
      await redisCacheStore.set(key, value);
      const stringifiedValue = JSON.stringify(value);
      expect(redisClient.set).toHaveBeenCalledWith(key, stringifiedValue);
    });

    it("should set to redis with correct key-value with ttl", async () => {
      const redisCacheStore = new RedisCacheStore();
      const createSpy = jest.spyOn(redis, "createClient");
      const redisClient = { connect: async () => {}, setEx: jest.fn() };
      type RedisClient = ReturnType<typeof redis.createClient>;
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisCacheStore.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      const value = { number: Math.random() };
      const ttl = Math.floor(Math.random() * 1000);
      await redisCacheStore.set(key, value, ttl);
      const sValue = JSON.stringify(value);
      expect(redisClient.setEx).toHaveBeenCalledWith(key, ttl, sValue);
    });

    it("should set to redis with correct key-value with ttl as a property in options", async () => {
      const redisCacheStore = new RedisCacheStore();
      const createSpy = jest.spyOn(redis, "createClient");
      const redisClient = { connect: async () => {}, setEx: jest.fn() };
      type RedisClient = ReturnType<typeof redis.createClient>;
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisCacheStore.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      const value = { number: Math.random() };
      const ttl = Math.floor(Math.random() * 1000);
      await redisCacheStore.set(key, value, { ttl });
      const sValue = JSON.stringify(value);
      expect(redisClient.setEx).toHaveBeenCalledWith(key, ttl, sValue);
    });

    it("should set to redis with correct key-value with ttl as a result of property function in options", async () => {
      const redisCacheStore = new RedisCacheStore();
      const createSpy = jest.spyOn(redis, "createClient");
      const redisClient = { connect: async () => {}, setEx: jest.fn() };
      type RedisClient = ReturnType<typeof redis.createClient>;
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisCacheStore.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      const value = { number: Math.random() };
      const ttl = (v: typeof value) => Math.floor(v.number * 1000);
      await redisCacheStore.set(key, value, { ttl });
      const sValue = JSON.stringify(value);
      expect(redisClient.setEx).toHaveBeenCalledWith(key, ttl(value), sValue);
    });
  });

  describe("get", () => {
    it("should throw error if client is not connected", async () => {
      const redisCacheStore = new RedisCacheStore();
      const promise = redisCacheStore.get("key");
      const error = new Error("redis not connected");
      await expect(promise).rejects.toThrow(error);
    });

    it("should get with correct key", async () => {
      const redisCacheStore = new RedisCacheStore();

      const redisClient = {
        connect: async () => {},
        get: jest.fn().mockResolvedValue("null"),
      };

      type RedisClient = ReturnType<typeof redis.createClient>;
      const createSpy = jest.spyOn(redis, "createClient");
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisCacheStore.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      await redisCacheStore.get(key);
      expect(redisClient.get).toHaveBeenCalledWith(key);
    });

    it("should retrieve the correct value", async () => {
      const redisCacheStore = new RedisCacheStore();
      const value = { number: Math.random() };

      const redisClient = {
        connect: async () => {},
        get: jest.fn().mockResolvedValue(JSON.stringify(value)),
      };

      type RedisClient = ReturnType<typeof redis.createClient>;
      const createSpy = jest.spyOn(redis, "createClient");
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisCacheStore.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      const result = await redisCacheStore.get(key);
      expect(result).toEqual(value);
    });
  });

  describe("del", () => {
    it("should throw error if client is not connected", async () => {
      const redisCacheStore = new RedisCacheStore();
      const promise = redisCacheStore.del("key");
      const error = new Error("redis not connected");
      await expect(promise).rejects.toThrow(error);
    });

    it("should delete with correct key", async () => {
      const redisCacheStore = new RedisCacheStore();
      const redisClient = { connect: async () => {}, del: jest.fn() };
      type RedisClient = ReturnType<typeof redis.createClient>;
      const createSpy = jest.spyOn(redis, "createClient");
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisCacheStore.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      await redisCacheStore.del(key);
      expect(redisClient.del).toHaveBeenCalledWith(key);
    });
  });
});
