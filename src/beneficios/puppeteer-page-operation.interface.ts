import type { Page } from "puppeteer";

export interface PuppeteerPageOperation {
  execute(
    page: Page,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>>;
}
