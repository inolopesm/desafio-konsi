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

    const pipeline = new PuppeteerPagePipeline();

    pipeline.register(new RedirectToUrlInsideFramePuppeteerPageOperation());

    pipeline.register(
      new FillLoginFormPuppeteerPageOperation(username, password)
    );

    pipeline.register(new SubmitLoginFormPuppeteerPageOperation());
    pipeline.register(new CloseRecentNewsPuppeteerPageOperation());
    pipeline.register(new CloseMenuPuppeteerPageOperation());
    pipeline.register(new OpenAccordeonPuppeteerPageOperation());
    pipeline.register(new FillFormPuppeteerPageOperation(cpf));
    pipeline.register(new SubmitFormPuppeteerPageOperation());
    pipeline.register(new ExtractResultPuppeteerPageOperation());

    return pipeline;
  }
}
