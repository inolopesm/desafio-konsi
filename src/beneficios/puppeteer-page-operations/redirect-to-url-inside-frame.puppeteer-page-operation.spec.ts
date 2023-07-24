import { Page } from "puppeteer";
import { RedirectToUrlInsideFramePuppeteerPageOperation } from "./redirect-to-url-inside-frame.puppeteer-page-operation";

describe("RedirectToUrlInsideFramePuppeteerPageOperation", () => {
  it("should wait for frame", async () => {
    const operation = new RedirectToUrlInsideFramePuppeteerPageOperation();

    const page = {
      waitForSelector: jest.fn(),
      evaluate: async () => "https://www.konsi.com.br/",
      goto: async () => {},
    };

    await operation.execute(page as unknown as Page, {});
    expect(page.waitForSelector).toHaveBeenCalledWith("frame");
  });

  it("should get the frame src attribute", async () => {
    const operation = new RedirectToUrlInsideFramePuppeteerPageOperation();
    const src = "https://www.konsi.com.br/";
    const querySelector = jest.fn().mockReturnValue({ src });
    let result: unknown;

    const page = {
      waitForSelector: async () => {},
      evaluate: async (pageFunction: () => unknown) => {
        const window = { document: { querySelector } };
        const bindedPageFunction = pageFunction.bind(window);
        result = bindedPageFunction();
        return result;
      },
      goto: async () => {},
    };

    await operation.execute(page as unknown as Page, {});
    expect(querySelector).toHaveBeenCalledWith("frame");
    expect(result).toEqual(src);
  });

  it("should throw an error if url has not found", async () => {
    const operation = new RedirectToUrlInsideFramePuppeteerPageOperation();

    const page = {
      waitForSelector: async () => {},
      evaluate: async () => undefined,
      goto: async () => {},
    };

    const promise = operation.execute(page as unknown as Page, {});
    await expect(promise).rejects.toThrow(new Error("url not found"));
  });

  it("should go to url", async () => {
    const operation = new RedirectToUrlInsideFramePuppeteerPageOperation();

    const page = {
      waitForSelector: async () => {},
      evaluate: async () => "https://www.konsi.com.br/",
      goto: jest.fn(),
    };

    await operation.execute(page as unknown as Page, {});
    expect(page.goto).toHaveBeenCalledWith("https://www.konsi.com.br/");
  });

  it("should return the same data it received", async () => {
    const operation = new RedirectToUrlInsideFramePuppeteerPageOperation();

    const page = {
      waitForSelector: async () => {},
      evaluate: async () => "https://www.konsi.com.br/",
      goto: async () => {},
    };

    const data = { number: Math.random() };
    const result = await operation.execute(page as unknown as Page, data);
    expect(result).toEqual(data);
  });
});
