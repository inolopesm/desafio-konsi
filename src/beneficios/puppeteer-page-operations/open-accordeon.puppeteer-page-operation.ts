import type { Page } from "puppeteer";
import { PuppeteerPageOperation } from "../puppeteer-page-operation.interface";

export class OpenAccordeonPuppeteerPageOperation
  implements PuppeteerPageOperation
{
  async execute(page: Page, data: Record<string, unknown>) {
    await page.waitForFunction(
      'document.querySelector("ion-button:nth-child(15)")?.innerText === "ENCONTRAR BENEFÍCIOS DE UM CPF"'
    );

    await page.evaluate(function (this: Window) {
      this.document
        .querySelector<HTMLElement>("ion-button:nth-child(15)")!
        .click();
    });

    return data;
  }
}
