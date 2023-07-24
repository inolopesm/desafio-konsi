import type { Page } from "puppeteer";
import type { PuppeteerPageOperation } from "../../puppeteer";

export class FillFormPuppeteerPageOperation implements PuppeteerPageOperation {
  constructor(private readonly cpf: string) {}

  async execute(page: Page, data: Record<string, unknown>) {
    await page.waitForSelector('input[name="ion-input-1"]', { visible: true });
    await page.type('input[name="ion-input-1"]', this.cpf);
    return data;
  }
}
