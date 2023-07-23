import type { Page } from "puppeteer";
import { CloseRecentNewsPuppeteerPageOperation } from "./close-recent-news.puppeteer-page-operation";

describe("CloseRecentNewsPuppeteerPageOperation", () => {
  it("should wait for close button to be visible", async () => {
    const operation = new CloseRecentNewsPuppeteerPageOperation();
    const page = { waitForSelector: jest.fn(), click: jest.fn() };
    await operation.execute(page as unknown as Page, {});
    const args = ['ion-button[title="Fechar"]', { visible: true }] as const;
    expect(page.waitForSelector).toHaveBeenCalledWith(...args);
  });

  it("should click on the close button", async () => {
    const operation = new CloseRecentNewsPuppeteerPageOperation();
    const page = { waitForSelector: jest.fn(), click: jest.fn() };
    await operation.execute(page as unknown as Page, {});
    expect(page.click).toHaveBeenCalledWith('ion-button[title="Fechar"]');
  });

  it("should return the same data it received", async () => {
    const operation = new CloseRecentNewsPuppeteerPageOperation();
    const page = { waitForSelector: jest.fn(), click: jest.fn() };
    const data = { number: Math.random() };
    const result = await operation.execute(page as unknown as Page, data);
    expect(result).toEqual(data);
  });
});
