import { Injectable } from "@nestjs/common";
import puppeteer from "puppeteer";
import { PuppeteerPageOperationException } from "../puppeteer";
import { BeneficiosPuppeteerPagePipelineFactory } from "./beneficios-puppeteer-page-pipeline.factory";

interface FindOneParams {
  cpf: string;
  username: string;
  password: string;
}

interface FindOneResult {
  beneficio: string;
}

@Injectable()
export class BeneficiosProvider {
  async findOne(params: FindOneParams): Promise<FindOneResult | Error> {
    const pipeline = BeneficiosPuppeteerPagePipelineFactory.create(params);
    const browser = await puppeteer.launch({ headless: "new" });

    try {
      const page = await browser.newPage();
      await page.goto("http://extratoclube.com.br/");
      const data = await pipeline.invoke(page);
      const { beneficio } = data as { beneficio: string }; // can have more props inside
      return { beneficio };
    } catch (error) {
      if (error instanceof PuppeteerPageOperationException) {
        return error;
      }

      throw error;
    } finally {
      await browser.close();
    }
  }
}
