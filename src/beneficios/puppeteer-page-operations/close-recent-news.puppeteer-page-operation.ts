import type { Page } from "puppeteer";
import { PuppeteerPageOperation } from "../puppeteer-page-operation.interface";

export class CloseRecentNewsPuppeteerPageOperation
  implements PuppeteerPageOperation
{
  async execute(page: Page, data: Record<string, unknown>) {
    await page.waitForSelector('ion-button[title="Fechar"]', { visible: true });
    await page.click('ion-button[title="Fechar"]');
    return data;
  }
}
