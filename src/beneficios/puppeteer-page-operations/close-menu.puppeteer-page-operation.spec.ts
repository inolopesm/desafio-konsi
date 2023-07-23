import type { Page } from "puppeteer";
import { CloseMenuPuppeteerPageOperation } from "./close-menu.puppeteer-page-operation";

describe("CloseMenuPuppeteerPageOperation", () => {
  it("should wait for selector ion-menu", async () => {
    const operation = new CloseMenuPuppeteerPageOperation();

    const page = {
      waitForSelector: jest.fn(),
      evaluate: jest.fn(),
    };

    await operation.execute(page as unknown as Page, {});

    expect(page.waitForSelector).toHaveBeenCalledWith("ion-menu", {
      visible: true,
    });
  });

  it("should click menu backdrop", async () => {
    const operation = new CloseMenuPuppeteerPageOperation();

    const backdropClick = jest.fn();

    const menuShadowRootQuerySelector = jest
      .fn()
      .mockReturnValue({ click: backdropClick });

    const menuShadowRoot = { querySelector: menuShadowRootQuerySelector };

    const documentQuerySelector = jest
      .fn()
      .mockReturnValue({ shadowRoot: menuShadowRoot });

    const page = {
      waitForSelector: jest.fn(),
      evaluate: (pageFunction: () => void) => {
        const window = { document: { querySelector: documentQuerySelector } };
        const bindedPageFunction = pageFunction.bind(window);
        bindedPageFunction();
      },
    };

    await operation.execute(page as unknown as Page, {});
    expect(documentQuerySelector).toHaveBeenCalledWith("ion-menu");
    expect(menuShadowRootQuerySelector).toHaveBeenCalledWith("ion-backdrop");
    expect(backdropClick).toHaveBeenCalled();
  });

  it("should throw an error if menu has not found", async () => {
    const operation = new CloseMenuPuppeteerPageOperation();

    const page = {
      waitForSelector: jest.fn(),
      evaluate: (pageFunction: () => void) => {
        const window = { document: { querySelector: () => null } };
        const bindedPageFunction = pageFunction.bind(window);
        bindedPageFunction();
      },
    };

    const promise = operation.execute(page as unknown as Page, {});
    await expect(promise).rejects.toThrow(new Error("menu not found"));
  });

  it("should throw an error if menu doesnt have shadow root", async () => {
    const operation = new CloseMenuPuppeteerPageOperation();

    const page = {
      waitForSelector: jest.fn(),
      evaluate: (pageFunction: () => void) => {
        const window = {
          document: { querySelector: () => ({ shadowRoot: null }) },
        };

        const bindedPageFunction = pageFunction.bind(window);
        bindedPageFunction();
      },
    };

    const promise = operation.execute(page as unknown as Page, {});

    await expect(promise).rejects.toThrow(
      new Error("menu doesnt have shadow root")
    );
  });

  it("should throw an error if backdrop has not found", async () => {
    const operation = new CloseMenuPuppeteerPageOperation();

    const page = {
      waitForSelector: jest.fn(),
      evaluate: (pageFunction: () => void) => {
        const window = {
          document: {
            querySelector: () => ({
              shadowRoot: { querySelector: () => null },
            }),
          },
        };

        const bindedPageFunction = pageFunction.bind(window);
        bindedPageFunction();
      },
    };

    const promise = operation.execute(page as unknown as Page, {});
    await expect(promise).rejects.toThrow(new Error("backdrop not found"));
  });
});
