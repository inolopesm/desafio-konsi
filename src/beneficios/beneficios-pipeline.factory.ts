import { PuppeteerPagePipeline } from "./puppeteer-page.pipeline";

import {
  FillLoginFormPuppeteerPageOperation,
  SubmitLoginFormPuppeteerPageOperation,
  CloseRecentNewsPuppeteerPageOperation,
  CloseMenuPuppeteerPageOperation,
  OpenAccordeonPuppeteerPageOperation,
  FillFormPuppeteerPageOperation,
  ExtractResultPuppeteerPageOperation,
  RedirectToUrlInsideFramePuppeteerPageOperation,
} from "./puppeteer-page-operations";

import { SubmitFormPuppeteerPageOperation } from "./puppeteer-page-operations/submit-form.puppeteer-page-operation";

interface CreateParams {
  cpf: string;
  username: string;
  password: string;
}

export class BeneficiosPipelineFactory {
  static create(params: CreateParams) {
    const { cpf, username, password } = params;

    const pipeline = new PuppeteerPagePipeline([
      new RedirectToUrlInsideFramePuppeteerPageOperation(),
      new FillLoginFormPuppeteerPageOperation(username, password),
      new SubmitLoginFormPuppeteerPageOperation(),
      new CloseRecentNewsPuppeteerPageOperation(),
      new CloseMenuPuppeteerPageOperation(),
      new OpenAccordeonPuppeteerPageOperation(),
      new FillFormPuppeteerPageOperation(cpf),
      new SubmitFormPuppeteerPageOperation(),
      new ExtractResultPuppeteerPageOperation(),
    ]);

    return pipeline;
  }
}
