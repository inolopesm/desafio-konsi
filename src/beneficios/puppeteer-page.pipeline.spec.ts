import type { Page } from "puppeteer";
import { PuppeteerPagePipeline } from "./puppeteer-page.pipeline";

describe("PuppeteerPagePipeline", () => {
  it("should invoke all registered operations", async () => {
    const operation1 = { execute: jest.fn().mockResolvedValue({ i: 1 }) };
    const operation2 = { execute: jest.fn() };
    const pipeline = new PuppeteerPagePipeline([operation1, operation2]);
    const page = { [Symbol()]: Math.random() };
    await pipeline.invoke(page as unknown as Page);
    expect(operation1.execute).toHaveBeenCalledWith(page, {});
    expect(operation2.execute).toHaveBeenCalledWith(page, { i: 1 });
  });

  it("should return what the last operation returned", async () => {
    const operation1 = { execute: async () => ({ i: 1 }) };
    const operation2 = { execute: async () => ({ i: 2 }) };
    const pipeline = new PuppeteerPagePipeline([operation1, operation2]);
    const data = await pipeline.invoke({} as unknown as Page);
    expect(data).toEqual({ i: 2 });
  });
});
