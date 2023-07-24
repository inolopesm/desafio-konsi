import puppeteer from "puppeteer";
import { BeneficiosPuppeteerPagePipelineFactory } from "./beneficios-puppeteer-page-pipeline.factory";
import { BeneficiosProvider } from "./beneficios.provider";
import { PuppeteerPageOperationException } from "../puppeteer";

const goto = jest.fn();
const page = { [Symbol()]: Math.random(), goto };
const newPage = jest.fn().mockResolvedValue(page);
const close = jest.fn();
const data = { beneficio: Math.random().toString().substring(2) };
const invoke = jest.fn().mockResolvedValue(data);

const params = {
  cpf: "000.000.000-00",
  username: "username",
  password: "password",
};

jest.mock("puppeteer", () => ({
  default: {
    launch: jest.fn().mockImplementation(async () => ({ newPage, close })),
  },
}));

jest.mock("./beneficios-puppeteer-page-pipeline.factory", () => ({
  BeneficiosPuppeteerPagePipelineFactory: {
    create: jest.fn().mockImplementation(() => ({ invoke })),
  },
}));

describe("BeneficiosProvider", () => {
  it("should create pipeline with correct params", async () => {
    const provider = new BeneficiosProvider();
    await provider.findOne(params);

    expect(BeneficiosPuppeteerPagePipelineFactory.create).toHaveBeenCalledWith(
      params
    );
  });

  it("should launch a browser", async () => {
    const provider = new BeneficiosProvider();
    await provider.findOne(params);
    expect(puppeteer.launch).toHaveBeenCalledWith({ headless: "new" });
  });

  it("should goto extrato clube page", async () => {
    const provider = new BeneficiosProvider();
    await provider.findOne(params);
    expect(goto).toHaveBeenCalledWith("http://extratoclube.com.br/");
  });

  it("should invoke pipeline", async () => {
    const provider = new BeneficiosProvider();
    await provider.findOne(params);
    expect(invoke).toHaveBeenCalledWith(page);
  });

  it("should return beneficio received from pipeline", async () => {
    const provider = new BeneficiosProvider();
    const result = await provider.findOne(params);
    expect(result).toEqual({ beneficio: data.beneficio });
  });

  it("should return exception if throws", async () => {
    const provider = new BeneficiosProvider();
    invoke.mockRejectedValueOnce(new PuppeteerPageOperationException());
    const result = await provider.findOne(params);
    expect(result).toEqual(new PuppeteerPageOperationException());
  });

  it("should throw if throws", async () => {
    const provider = new BeneficiosProvider();
    invoke.mockRejectedValueOnce(new Error());
    const promise = provider.findOne(params);
    await expect(promise).rejects.toThrow(new Error());
  });

  it("should close browser when success", async () => {
    const provider = new BeneficiosProvider();
    await provider.findOne(params);
    expect(close).toHaveBeenCalled();
  });

  it("should close browser when fail", async () => {
    const provider = new BeneficiosProvider();
    invoke.mockRejectedValueOnce(new Error());
    await provider.findOne(params).catch(() => {});
    expect(close).toHaveBeenCalled();
  });
});
