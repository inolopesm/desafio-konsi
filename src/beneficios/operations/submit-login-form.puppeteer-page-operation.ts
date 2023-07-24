import { type Page, TimeoutError } from "puppeteer";

import {
  type PuppeteerPageOperation,
  PuppeteerPageOperationException,
} from "../../puppeteer";

export class SubmitLoginFormPuppeteerPageOperation
  implements PuppeteerPageOperation
{
  async execute(page: Page, data: Record<string, unknown>) {
    await page.waitForSelector("#botao");

    try {
      await page.click("#botao");
      await page.waitForNavigation();
    } catch (error) {
      if (error instanceof TimeoutError) {
        const message = await page.evaluate(function (this: Window) {
          return this.document.querySelector<HTMLElement>("#alert-1-msg")
            ?.innerText;
        });

        if (message) throw new PuppeteerPageOperationException(message);
        throw new Error("#alert-1-msg not found", { cause: error });
      }

      throw error;
    }

    return data;
  }
}
