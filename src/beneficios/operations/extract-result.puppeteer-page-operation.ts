import type { Page } from "puppeteer";

import {
  type PuppeteerPageOperation,
  PuppeteerPageOperationException,
} from "../../puppeteer";

export class ExtractResultPuppeteerPageOperation
  implements PuppeteerPageOperation
{
  async execute(page: Page, data: Record<string, unknown>) {
    const result = await page.evaluate(function (this: Window) {
      return this.document.querySelector<HTMLElement>(".item-label")!.innerText;
    });

    if (result === "Matrícula não encontrada!")
      throw new PuppeteerPageOperationException(result);

    const onlyNumbers = /^\d+$/.test(result);
    if (!onlyNumbers) throw new Error(`Unexpected result: ${result}`);

    return { ...data, beneficio: result };
  }
}
