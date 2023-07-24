import { PuppeteerPagePipeline } from "../puppeteer";
import { BeneficiosPuppeteerPagePipelineFactory } from "./beneficios-puppeteer-page-pipeline.factory";

import {
  CloseMenuPuppeteerPageOperation,
  CloseRecentNewsPuppeteerPageOperation,
  ExtractResultPuppeteerPageOperation,
  FillFormPuppeteerPageOperation,
  FillLoginFormPuppeteerPageOperation,
  OpenAccordeonPuppeteerPageOperation,
  RedirectToUrlInsideFramePuppeteerPageOperation,
  SubmitFormPuppeteerPageOperation,
  SubmitLoginFormPuppeteerPageOperation,
} from "./operations";

jest.mock("../puppeteer/puppeteer-page.pipeline");

describe("BeneficiosPuppeteerPagePipelineFactory", () => {
  it("should call PuppeteerPagePipeline with all operations", () => {
    const params = { cpf: "cpf", username: "username", password: "password" };
    BeneficiosPuppeteerPagePipelineFactory.create(params);
    const { cpf, username, password } = params;

    const operations = [
      new RedirectToUrlInsideFramePuppeteerPageOperation(),
      new FillLoginFormPuppeteerPageOperation(username, password),
      new SubmitLoginFormPuppeteerPageOperation(),
      new CloseRecentNewsPuppeteerPageOperation(),
      new CloseMenuPuppeteerPageOperation(),
      new OpenAccordeonPuppeteerPageOperation(),
      new FillFormPuppeteerPageOperation(cpf),
      new SubmitFormPuppeteerPageOperation(),
      new ExtractResultPuppeteerPageOperation(),
    ];

    expect(PuppeteerPagePipeline).toHaveBeenCalledWith(operations);
  });
});
