import { PuppeteerPagePipeline } from "../puppeteer";

import {
  FillLoginFormPuppeteerPageOperation,
  SubmitLoginFormPuppeteerPageOperation,
  CloseRecentNewsPuppeteerPageOperation,
  CloseMenuPuppeteerPageOperation,
  OpenAccordeonPuppeteerPageOperation,
  FillFormPuppeteerPageOperation,
  ExtractResultPuppeteerPageOperation,
  RedirectToUrlInsideFramePuppeteerPageOperation,
  SubmitFormPuppeteerPageOperation,
} from "./puppeteer-page-operations";

interface CreateParams {
  cpf: string;
  username: string;
  password: string;
}

export class BeneficiosPuppeteerPagePipelineFactory {
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
