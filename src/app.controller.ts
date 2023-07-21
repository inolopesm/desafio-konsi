import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import puppeteer, { TimeoutError } from "puppeteer";
import { RMQ_SERVICE } from "./tokens";
import { CreateQueryDto } from "./create-query.dto";

@Controller()
export class AppController {
  constructor(@Inject(RMQ_SERVICE) private readonly client: ClientProxy) {}

  @Post("query")
  send(@Body() createQueryDto: CreateQueryDto) {
    this.client.emit("create-query", createQueryDto);
  }

  @MessagePattern("create-query")
  async handleMessage(@Payload() createQueryDto: CreateQueryDto) {
    const response = await fetch("http://extratoclube.com.br/");
    const html = await response.text();
    const [, url] = html.match(/<frame src="([A-Za-z0-9:\/\-\.]+)"/) ?? [];
    if (!url) throw new Error("no url found");

    const browser = await puppeteer.launch({ headless: "new" });

    try {
      const page = await browser.newPage();

      try {
        await page.goto(url);
        await page.waitForSelector("#user");
        await page.type("#user", createQueryDto.username);
        await page.waitForSelector("#pass");
        await page.type("#pass", createQueryDto.password);
        await page.waitForSelector("#botao");

        try {
          await Promise.all([
            page.click("#botao"),
            page.waitForNavigation({ timeout: 5000 }),
          ]);
        } catch (error) {
          if (error instanceof TimeoutError) {
            const error = await page.evaluate(
              () =>
                document.querySelector<HTMLDivElement>("#alert-1-msg")
                  ?.innerText
            );

            if (error) throw new Error(error);

            throw new Error("wait for 5s and #alert-1-msg not found", {
              cause: error,
            });
          }

          throw error;
        }
      } finally {
        page.close();
      }

      console.log("received", createQueryDto);
    } finally {
      await browser.close();
    }
  }
}
