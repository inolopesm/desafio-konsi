import type { Page } from "puppeteer";
import { OpenAccordeonPuppeteerPageOperation } from "./open-accordeon.puppeteer-page-operation";

describe("OpenAccordeonPuppeteerPageOperation", () => {
  it("should wait for selector to be the correct button", async () => {
    const operation = new OpenAccordeonPuppeteerPageOperation();
    const page = { waitForFunction: jest.fn(), evaluate: async () => {} };
    await operation.execute(page as unknown as Page, {});

    expect(page.waitForFunction).toHaveBeenCalledWith(
      'document.querySelector("ion-button:nth-child(15)")?.innerText === "ENCONTRAR BENEFÍCIOS DE UM CPF"'
    );
  });

  it("should click the correct button", async () => {
    const operation = new OpenAccordeonPuppeteerPageOperation();
    const click = jest.fn();
    const querySelector = jest.fn().mockReturnValue({ click });

    const page = {
      waitForFunction: async () => {},
      evaluate: async (pageFunction: () => void) => {
        const window = { document: { querySelector } };
        const bindedPageFunction = pageFunction.bind(window);
        bindedPageFunction();
      },
    };

    await operation.execute(page as unknown as Page, {});
    expect(querySelector).toHaveBeenCalledWith("ion-button:nth-child(15)");
    expect(click).toHaveBeenCalled();
  });

  it("should return the same data it received", async () => {
    const operation = new OpenAccordeonPuppeteerPageOperation();
    const page = { waitForFunction: async () => {}, evaluate: async () => {} };
    const data = { number: Math.random() };
    const result = await operation.execute(page as unknown as Page, data);
    expect(result).toEqual(data);
  });
});
