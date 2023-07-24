import type { Page } from "puppeteer";
import { PuppeteerPageOperation } from "../puppeteer-page-operation.interface";

export class FillFormPuppeteerPageOperation implements PuppeteerPageOperation {
  constructor(private readonly cpf: string) {}

  async execute(page: Page, data: Record<string, unknown>) {
    await page.waitForSelector('input[name="ion-input-1"]', { visible: true });
    await page.type('input[name="ion-input-1"]', this.cpf, { delay: 1000 });
    return data;
  }
}
