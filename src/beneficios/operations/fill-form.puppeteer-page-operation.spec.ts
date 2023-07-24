import type { Page } from "puppeteer";
import { FillFormPuppeteerPageOperation } from "./fill-form.puppeteer-page-operation";

describe("FillFormPuppeteerPageOperation", () => {
  it("should wait for input to be visible", async () => {
    const cpf = "000.000.000-00";
    const operation = new FillFormPuppeteerPageOperation(cpf);
    const page = { waitForSelector: jest.fn(), type: async () => {} };
    await operation.execute(page as unknown as Page, {});
    const args = ['input[name="ion-input-1"]', { visible: true }] as const;
    expect(page.waitForSelector).toHaveBeenCalledWith(...args);
  });

  it("should write the cpf in the input", async () => {
    const cpf = "000.000.000-" + Math.ceil(Math.random() * 100);
    const operation = new FillFormPuppeteerPageOperation(cpf);
    const page = { waitForSelector: async () => {}, type: jest.fn() };
    await operation.execute(page as unknown as Page, {});
    const args = ['input[name="ion-input-1"]', cpf] as const;
    expect(page.type).toHaveBeenCalledWith(...args);
  });

  it("should return the same data it received", async () => {
    const cpf = "000.000.000-00";
    const operation = new FillFormPuppeteerPageOperation(cpf);
    const page = { waitForSelector: async () => {}, type: async () => {} };
    const data = { number: Math.random() };
    const result = await operation.execute(page as unknown as Page, data);
    expect(result).toEqual(data);
  });
});
