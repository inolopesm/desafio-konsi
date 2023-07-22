import type { Page } from "puppeteer";
import type { PuppeteerPageOperation } from "./puppeteer-page-operation.interface";

export class PuppeteerPagePipeline {
  private readonly operations: PuppeteerPageOperation[] = [];

  register(operation: PuppeteerPageOperation) {
    this.operations.push(operation);
  }

  async invoke(page: Page) {
    let data: Record<string, unknown> = {};

    for (const operation of this.operations) {
      data = await operation.execute(page, data);
    }

    return data;
  }
}
