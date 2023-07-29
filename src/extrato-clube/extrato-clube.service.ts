import { Injectable } from "@nestjs/common";
// import puppeteer from "puppeteer";
import { HttpClient, HttpClientError } from "../common";

export interface LoginParams {
  login: string;
  senha: string;
}

export interface LoginResult {
  authorization: string;
}

export interface FindNBsParams {
  cpf: string;
  authorization: string;
}

export interface FindNBsResponseBody {
  beneficios: Array<{ nb: string }>;
}

export interface FindNBsResult {
  nbs: string[];
}

@Injectable()
export class ExtratoClubeService {
  async login({ login, senha }: LoginParams): Promise<LoginResult | Error> {
    try {
      const response = await HttpClient.request(
        "http://extratoblubeapp-env.eba-mvegshhd.sa-east-1.elasticbeanstalk.com/login",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ login, senha }),
        }
      );

      const authorization = response.headers.get("Authorization");

      if (!authorization) {
        throw new Error("Authorization not found");
      }

      return { authorization };
    } catch (error) {
      if (error instanceof HttpClientError) {
        return error;
      }

      throw error;
    }
  }

  /** Find the Números de Benefícios (NB) in Extrato Clube using API */
  async findNBs({
    authorization,
    cpf,
  }: FindNBsParams): Promise<FindNBsResult | Error> {
    try {
      const response = await HttpClient.request<FindNBsResponseBody>(
        `http://extratoblubeapp-env.eba-mvegshhd.sa-east-1.elasticbeanstalk.com/offline/listagem/${cpf}`,
        { headers: { authorization } }
      );

      const nbs = new Array<string>();

      for (const beneficio of response.data.beneficios) {
        if (beneficio.nb === "Matrícula não encontrada!") {
          return new Error("No NB was found in this CPF");
        }

        nbs.push(beneficio.nb);
      }

      return { nbs };
    } catch (error) {
      if (error instanceof HttpClientError) {
        return error;
      }

      throw error;
    }
  }

  /**
   * Find the Número de Benefício (NB) in Extrato Clube using Puppeteer
   * @depracated
   */
  async findNB(
    user: string,
    pass: string,
    cpf: string
  ): Promise<{ nb: string } | Error> {
    const loginResult = await this.login({ login: user, senha: pass });

    if (loginResult instanceof Error) {
      const error = loginResult;
      return error;
    }

    const { authorization } = loginResult;
    const findResult = await this.findNBs({ authorization, cpf });

    if (findResult instanceof Error) {
      const error = findResult;
      return error;
    }

    const [nb] = findResult.nbs;

    if (!nb) {
      return new Error("NB not found");
    }

    return { nb };

    // const browser = await puppeteer.launch({ headless: false });

    // try {
    //   log("[ExtratoClubeService][findNB] redirect...");
    //   const page = await browser.newPage();
    //   await page.goto("http://extratoclube.com.br/");
    //   await page.waitForSelector("frame");

    //   const url = await page.evaluate(function (this: Window) {
    //     return this.document.querySelector("frame")?.src;
    //   });

    //   if (!url) throw new Error("url not found");
    //   await page.goto(url);

    //   log("[ExtratoClubeService][findNB] login...");
    //   await page.waitForSelector("#user");
    //   await page.type("#user", user, { delay: 200 });
    //   await page.waitForSelector("#pass");
    //   await page.type("#pass", pass, { delay: 200 });

    //   await page.waitForSelector("#botao");
    //   await page.click("#botao");

    //   const loginResponse = await page.waitForResponse(
    //     (res) => res.request().method() === "POST"
    //   );

    //   if (loginResponse.ok()) {
    //     await page.waitForNavigation();
    //   } else {
    //     const message = await page.evaluate(function (this: Window) {
    //       const alrt = this.document.querySelector<HTMLElement>("#alert-1-msg");
    //       return alrt?.innerText;
    //     });

    //     if (message) {
    //       return new Error(`Login failed with message: ${message}`);
    //     }

    //     throw new Error("Login failed");
    //   }

    //   log("[ExtratoClubeService][findNB] recent news modal...");
    //   await page.waitForSelector("ion-button[title=Fechar]");

    //   await page.evaluate(function (this: Window) {
    //     const selector = "ion-button[title=Fechar]";
    //     const button = this.document.querySelector<HTMLElement>(selector);
    //     if (!button) throw new Error("close button not found");
    //     button.click();
    //   });

    // log("[ExtratoClubeService][findNB] menu...");
    // let closed = false;

    // for (let i = 5; i > 0; i--) {
    //   // i = tries
    //   closed = await page.evaluate(function (this: Window) {
    //     const menu = this.document.querySelector<HTMLElement>("ion-menu");
    //     if (!menu) return false;
    //     const sr = menu.shadowRoot;
    //     if (!sr) return false;
    //     const bd = sr.querySelector<HTMLElement>("ion-backdrop");
    //     if (!bd) return false;

    //     if (bd.classList.contains("show-backdrop")) {
    //       bd.click();
    //       return false;
    //     }

    //     return true;
    //   });

    //   if (closed) {
    //     break;
    //   }
    // }

    // if (!closed) {
    //   throw new Error("Cannot close menu");
    // }

    // log("[ExtratoClubeService][findNB] find benefits accordeon...");

    // await page.waitForFunction(
    //   "document.querySelector('ion-button:nth-child(17)')?.innerText === 'ENCONTRAR BENEFÍCIOS DE UM CPF'"
    // );

    // await page.click("ion-button:nth-child(17)");

    // log("[ExtratoClubeService][findNB] form...");
    // log("[ExtratoClubeService][findNB][form] typing...");
    // log("[ExtratoClubeService][findNB][form][typing] wait...");

    // await page.waitForFunction(
    //   "document.querySelector('input[name=ion-input-1]')?.placeholder === 'Digite o número do CPF . . .'"
    // );

    // log("[ExtratoClubeService][findNB][form][typing] type...");

    // await page.type("input[name=ion-input-1]", cpf, { delay: 200 });

    // log("[ExtratoClubeService][findNB][form] submit...");

    // await page.waitForFunction(
    //   "document.querySelector('ion-button.configverde')?.innerText === 'PROCURAR'"
    // );

    // await page.click("ion-button.configverde");

    // const findResponse = await page.waitForResponse(
    //   (res) => res.request().method() === "GET"
    // );

    // if (findResponse.status() === 404) {
    //   const message = await page.evaluate(function (this: Window) {
    //     const alrt = this.document.querySelector<HTMLElement>("#alert-3-msg");
    //     return alrt?.innerText;
    //   });

    //   if (message) {
    //     return new Error(`Login failed with message: ${message}`);
    //   }

    //   throw new Error("Login failed");
    // }

    // if (!findResponse.ok()) {
    //   throw new Error(`Unexpected status code: ${findResponse.status()}`);
    // }

    // await page.waitForFunction(
    //   "document.querySelector('ion-button.ion-color-primary')?.innerText === 'RESULTADO'"
    // );

    // const result = await page.evaluate(function (this: Window) {
    //   return this.document.querySelector<HTMLElement>("ion-label")?.innerText;
    // });

    // if (!result) {
    //   throw new Error("Cannot get result");
    // }

    // if (result === "Matrícula não encontrada!") {
    //   return new Error("CPF not found");
    // }

    // return { nb: result };
    // } finally {
    //   browser.close();
    // }
  }
}
