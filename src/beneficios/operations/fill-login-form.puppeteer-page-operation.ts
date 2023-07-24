import type { Page } from "puppeteer";
import type { PuppeteerPageOperation } from "../../puppeteer";

export class FillLoginFormPuppeteerPageOperation
  implements PuppeteerPageOperation
{
  constructor(
    private readonly username: string,
    private readonly password: string
  ) {}

  async execute(page: Page, data: Record<string, unknown>) {
    await page.waitForSelector("#user");
    await page.type("#user", this.username);
    await page.waitForSelector("#pass");
    await page.type("#pass", this.password);
    return data;
  }
}
