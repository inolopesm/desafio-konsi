import type { Page } from "puppeteer";
import { FillLoginFormPuppeteerPageOperation } from "./fill-login-form.puppeteer-page-operation";

describe("FillLoginFormPuppeteerPageOperation", () => {
  it("should wait for username field", async () => {
    const operation = new FillLoginFormPuppeteerPageOperation("math", "123");
    const page = { waitForSelector: jest.fn(), type: async () => {} };
    await operation.execute(page as unknown as Page, {});
    expect(page.waitForSelector).toHaveBeenCalledWith("#user");
  });

  it("should write the username in correct input", async () => {
    const operation = new FillLoginFormPuppeteerPageOperation("math", "123");
    const page = { waitForSelector: async () => {}, type: jest.fn() };
    await operation.execute(page as unknown as Page, {});
    expect(page.type).toHaveBeenCalledWith("#user", "math");
  });

  it("should wait for password field", async () => {
    const operation = new FillLoginFormPuppeteerPageOperation("math", "123");
    const page = { waitForSelector: jest.fn(), type: async () => {} };
    await operation.execute(page as unknown as Page, {});
    expect(page.waitForSelector).toHaveBeenCalledWith("#pass");
  });

  it("should write the password in correct input", async () => {
    const operation = new FillLoginFormPuppeteerPageOperation("math", "123");
    const page = { waitForSelector: async () => {}, type: jest.fn() };
    await operation.execute(page as unknown as Page, {});
    expect(page.type).toHaveBeenCalledWith("#pass", "123");
  });

  it("should return the same data it received", async () => {
    const operation = new FillLoginFormPuppeteerPageOperation("math", "123");
    const page = { waitForSelector: async () => {}, type: async () => {} };
    const data = { number: Math.random() };
    const result = await operation.execute(page as unknown as Page, data);
    expect(result).toEqual(data);
  });
});
