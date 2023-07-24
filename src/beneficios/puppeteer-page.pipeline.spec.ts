import type { Page } from "puppeteer";
import { PuppeteerPagePipeline } from "./puppeteer-page.pipeline";
import { PuppeteerPageOperation } from "./puppeteer-page-operation.interface";

describe("PuppeteerPagePipeline", () => {
  it("should register operation", async () => {
    const pipeline = new PuppeteerPagePipeline();
    const operation: PuppeteerPageOperation = { execute: jest.fn() };
    pipeline.register(operation);
    await pipeline.invoke({} as unknown as Page);
    expect(operation.execute).toHaveBeenCalled();
  });

  it("should invoke all registered operations", async () => {
    const pipeline = new PuppeteerPagePipeline();
    const operation1 = { execute: jest.fn().mockResolvedValue({ i: 1 }) };
    const operation2 = { execute: jest.fn() };
    pipeline.register(operation1);
    pipeline.register(operation2);
    const page = { [Symbol()]: Math.random() };
    await pipeline.invoke(page as unknown as Page);
    expect(operation1.execute).toHaveBeenCalledWith(page, {});
    expect(operation2.execute).toHaveBeenCalledWith(page, { i: 1 });
  });

  it("should return what the last operation returned", async () => {
    const pipeline = new PuppeteerPagePipeline();
    const operation1 = { execute: async () => ({ i: 1 }) };
    const operation2 = { execute: async () => ({ i: 2 }) };
    pipeline.register(operation1);
    pipeline.register(operation2);
    const data = await pipeline.invoke({} as unknown as Page);
    expect(data).toEqual({ i: 2 });
  });
});
