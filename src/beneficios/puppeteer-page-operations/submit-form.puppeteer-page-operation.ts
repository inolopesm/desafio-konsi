import { type Page, TimeoutError } from "puppeteer";
import { PuppeteerPageOperation } from "../puppeteer-page-operation.interface";
import { PuppeteerPageOperationException } from "../puppeteer-page-operation.exception";

export class SubmitFormPuppeteerPageOperation
  implements PuppeteerPageOperation
{
  async execute(page: Page, data: Record<string, unknown>) {
    await page.evaluate(function (this: Window) {
      const button = Array.from(
        this.document.querySelectorAll<HTMLElement>("ion-button")
      ).find((element) => element.innerText === "PROCURAR");

      if (!button) throw new Error("button not found");
      button.click();
    });

    try {
      await page.waitForSelector(".item-label");
    } catch (error) {
      if (error instanceof TimeoutError) {
        const message = await page.evaluate(function (this: Window) {
          return this.document.querySelector<HTMLElement>("#alert-2-msg")
            ?.innerText;
        });

        if (message) throw new PuppeteerPageOperationException(message);
        throw new Error("#alert-2-msg not found", { cause: error });
      }
    }

    return data;
  }
}
