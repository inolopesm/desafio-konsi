import { Page } from "puppeteer";
import { ExtractResultPuppeteerPageOperation } from "./extract-result.puppeteer-page-operation";
import { PuppeteerPageOperationException } from "../../puppeteer";

describe("ExtractResultPuppeteerPageOperation", () => {
  it("should get the result", async () => {
    const operation = new ExtractResultPuppeteerPageOperation();
    const querySelector = jest.fn().mockReturnValue({ innerText: "123" });
    let result: unknown;

    const page = {
      evaluate: (pageFunction: () => void) => {
        const window = { document: { querySelector } };
        const bindedPageFunction = pageFunction.bind(window);
        result = bindedPageFunction();
        return result;
      },
    };

    await operation.execute(page as unknown as Page, {});
    expect(querySelector).toHaveBeenCalledWith(".item-label");
    expect(result).toEqual("123");
  });

  it("should return the same data it received and the beneficio", async () => {
    const operation = new ExtractResultPuppeteerPageOperation();
    const beneficio = "123";
    const data = { number: Math.random() };
    const page = { evaluate: async () => beneficio };
    const result = await operation.execute(page as unknown as Page, data);
    expect(result).toEqual({ ...data, beneficio });
  });

  it("should throw error if matricula has not found", async () => {
    const operation = new ExtractResultPuppeteerPageOperation();
    const result = "Matrícula não encontrada!";
    const page = { evaluate: async () => result };
    const promise = operation.execute(page as unknown as Page, {});
    const exception = new PuppeteerPageOperationException(result);
    await expect(promise).rejects.toThrow(exception);
  });

  it("should throw error is result contain a non-numbers", async () => {
    const operation = new ExtractResultPuppeteerPageOperation();
    const result = "non-numbers result";
    const page = { evaluate: async () => result };
    const promise = operation.execute(page as unknown as Page, {});
    const error = new Error(`Unexpected result: ${result}`);
    await expect(promise).rejects.toThrow(error);
  });
});
