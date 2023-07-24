import type { Page } from "puppeteer";
import type { PuppeteerPageOperation } from "../../puppeteer";

export class CloseMenuPuppeteerPageOperation implements PuppeteerPageOperation {
  async execute(page: Page, data: Record<string, unknown>) {
    await page.waitForSelector("ion-menu", { visible: true });

    await page.evaluate(function (this: Window) {
      const menu = this.document.querySelector("ion-menu");
      if (!menu) throw new Error("menu not found");
      if (!menu.shadowRoot) throw new Error("menu doesnt have shadow root");

      const backdrop =
        menu.shadowRoot.querySelector<HTMLElement>("ion-backdrop");

      if (!backdrop) throw new Error("backdrop not found");
      backdrop.click();
    });

    return data;
  }
}
