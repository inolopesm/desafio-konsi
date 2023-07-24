import type { Page } from "puppeteer";
import type { PuppeteerPageOperation } from "./puppeteer-page-operation.interface";

export class PuppeteerPagePipeline {
  constructor(private readonly operations: PuppeteerPageOperation[]) {}

  async invoke(page: Page) {
    let data: Record<string, unknown> = {};

    for (const operation of this.operations) {
      data = await operation.execute(page, data);
    }

    return data;
  }
}
