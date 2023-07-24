import type { Page } from "puppeteer";
import { PuppeteerPageOperation } from "../puppeteer-page-operation.interface";

export class RedirectToUrlInsideFramePuppeteerPageOperation
  implements PuppeteerPageOperation
{
  async execute(page: Page, data: Record<string, unknown>) {
    await page.waitForSelector("frame");

    const url = await page.evaluate(function (this: Window) {
      return this.document.querySelector("frame")?.src;
    });

    if (!url) throw new Error("url not found");
    await page.goto(url);

    return data;
  }
}
