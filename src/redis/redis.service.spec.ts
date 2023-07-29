import { Test } from "@nestjs/testing";
import * as redis from "redis";
import { RedisService } from "./redis.service";

jest.mock("redis");

describe("RedisService", () => {
  let redisService: RedisService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    redisService = moduleRef.get(RedisService);
  });

  describe("connect", () => {
    it("should connect with redis with correct url", async () => {
      const createSpy = jest.spyOn(redis, "createClient");
      const redisClient = { connect: jest.fn() };
      type RedisClient = ReturnType<typeof redis.createClient>;
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      const url = "redis://localhost";
      await redisService.connect(url);
      expect(createSpy).toHaveBeenCalledWith({ url });
      expect(redisClient.connect).toHaveBeenCalled();
    });
  });

  describe("set", () => {
    it("should throw error if client is not connected", async () => {
      const promise = redisService.set("key", "value");
      const error = new Error("redis not connected");
      await expect(promise).rejects.toThrow(error);
    });

    it("should throw error if value is undefined", async () => {
      const createSpy = jest.spyOn(redis, "createClient");
      const redisClient = { connect: async () => {} };
      type RedisClient = ReturnType<typeof redis.createClient>;
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisService.connect("redis://localhost");
      const promise = redisService.set("key", undefined);
      const error = new Error("value cannot be undefined");
      await expect(promise).rejects.toThrow(error);
    });

    it("should set to redis with correct key-value", async () => {
      const createSpy = jest.spyOn(redis, "createClient");
      const redisClient = { connect: async () => {}, set: jest.fn() };
      type RedisClient = ReturnType<typeof redis.createClient>;
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisService.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      const value = { number: Math.random() };
      await redisService.set(key, value);
      const stringifiedValue = JSON.stringify(value);
      expect(redisClient.set).toHaveBeenCalledWith(key, stringifiedValue);
    });

    it("should set to redis with correct key-value with ttl", async () => {
      const createSpy = jest.spyOn(redis, "createClient");
      const redisClient = { connect: async () => {}, setEx: jest.fn() };
      type RedisClient = ReturnType<typeof redis.createClient>;
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisService.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      const value = { number: Math.random() };
      const ttl = Math.floor(Math.random() * 1000);
      await redisService.set(key, value, ttl);
      const sValue = JSON.stringify(value);
      expect(redisClient.setEx).toHaveBeenCalledWith(key, ttl, sValue);
    });
  });

  describe("get", () => {
    it("should throw error if client is not connected", async () => {
      const promise = redisService.get("key");
      const error = new Error("redis not connected");
      await expect(promise).rejects.toThrow(error);
    });

    it("should get with correct key", async () => {
      const redisClient = {
        connect: async () => {},
        get: jest.fn().mockResolvedValue("null"),
      };

      type RedisClient = ReturnType<typeof redis.createClient>;
      const createSpy = jest.spyOn(redis, "createClient");
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisService.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      await redisService.get(key);
      expect(redisClient.get).toHaveBeenCalledWith(key);
    });

    it("should retrieve the correct value", async () => {
      const value = { number: Math.random() };

      const redisClient = {
        connect: async () => {},
        get: jest.fn().mockResolvedValue(JSON.stringify(value)),
      };

      type RedisClient = ReturnType<typeof redis.createClient>;
      const createSpy = jest.spyOn(redis, "createClient");
      createSpy.mockReturnValue(redisClient as unknown as RedisClient);
      await redisService.connect("redis://localhost");
      const key = "key-" + Math.random().toString().substring(2);
      const result = await redisService.get(key);
      expect(result).toEqual(value);
    });
  });
});
