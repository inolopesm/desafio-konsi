import { Test } from "@nestjs/testing";
import { ExtratoClubeService } from "./extrato-clube.service";
import { HttpClient, HttpClientError } from "../common";

describe("ExtratoClubeService", () => {
  let service: ExtratoClubeService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ExtratoClubeService],
    }).compile();

    service = moduleRef.get(ExtratoClubeService);
  });

  describe("login", () => {
    it("should make a request to correct route in external api", async () => {
      const Authorization = "Auth " + Math.random().toString().substring(2);
      const response = { headers: new Headers({ Authorization }), data: null };

      const requestSpy = jest.spyOn(HttpClient, "request");
      requestSpy.mockResolvedValueOnce(response);

      const login = "login" + Math.random().toString().substring(2);
      const senha = "senha" + Math.random().toString().substring(2);
      await service.login({ login, senha });

      expect(requestSpy).toHaveBeenCalledWith(
        "http://extratoblubeapp-env.eba-mvegshhd.sa-east-1.elasticbeanstalk.com/login",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ login, senha }),
        }
      );
    });

    it("should return an error if authorization has not found", async () => {
      const response = { headers: new Headers(), data: null };
      jest.spyOn(HttpClient, "request").mockResolvedValueOnce(response);

      const promise = service.login({ login: "login", senha: "senha" });
      const error = new Error("Authorization not found");
      await expect(promise).rejects.toThrow(error);
    });

    it("should return the authorization header when success", async () => {
      const Authorization = "Auth " + Math.random().toString().substring(2);
      const response = { headers: new Headers({ Authorization }), data: null };
      jest.spyOn(HttpClient, "request").mockResolvedValueOnce(response);

      const result = await service.login({ login: "login", senha: "senha" });
      expect(result).toEqual({ authorization: Authorization });
    });

    it("should return the error if is instanceof HttpClientError", async () => {
      const error = new HttpClientError("random error");
      const requestSpy = jest.spyOn(HttpClient, "request");
      requestSpy.mockRejectedValueOnce(error);

      const result = await service.login({ login: "login", senha: "senha" });
      expect(result).toEqual(error);
    });

    it("should throw error in others cases", async () => {
      const error = new Error("unexpected error");
      jest.spyOn(HttpClient, "request").mockRejectedValueOnce(error);
      const promise = service.login({ login: "login", senha: "senha" });
      await expect(promise).rejects.toThrow(error);
    });
  });

  describe("findNBs", () => {
    it("should make a request to correct route in external api", async () => {
      const authorization = "Auth " + Math.random().toString().substring(2);
      const cpf = "000.000.000-" + Math.ceil(Math.random() * 100);

      const response = { headers: new Headers(), data: { beneficios: [] } };
      const requestSpy = jest.spyOn(HttpClient, "request");
      requestSpy.mockResolvedValueOnce(response);

      await service.findNBs({ authorization, cpf });

      expect(requestSpy).toHaveBeenCalledWith(
        `http://extratoblubeapp-env.eba-mvegshhd.sa-east-1.elasticbeanstalk.com/offline/listagem/${cpf}`,
        { headers: { authorization } }
      );
    });

    it("should return an error if no nb was found", async () => {
      const [authorization, cpf] = ["Auth token", "000.000.000-00"];
      const error = new Error("No NB was found in this CPF");

      const beneficios = [{ nb: "Matrícula não encontrada!" }];
      const response = { headers: new Headers(), data: { beneficios } };
      const requestSpy = jest.spyOn(HttpClient, "request");
      requestSpy.mockResolvedValueOnce(response);

      const result = await service.findNBs({ authorization, cpf });
      expect(result).toEqual(error);
    });

    it("should return nbs when success", async () => {
      const [authorization, cpf] = ["Auth token", "000.000.000-00"];

      const beneficios = [{ nb: "123456" }];
      const response = { headers: new Headers(), data: { beneficios } };
      const requestSpy = jest.spyOn(HttpClient, "request");
      requestSpy.mockResolvedValueOnce(response);

      const result = await service.findNBs({ authorization, cpf });
      expect(result).toEqual({ nbs: beneficios.map(({ nb }) => nb) });
    });

    it("should return the error if instanceof HttpClientError", async () => {
      const [authorization, cpf] = ["Auth token", "000.000.000-00"];
      const error = new HttpClientError("random error");

      const requestSpy = jest.spyOn(HttpClient, "request");
      requestSpy.mockRejectedValueOnce(error);

      const result = await service.findNBs({ authorization, cpf });
      expect(result).toEqual(error);
    });

    it("should throw error in others cases", async () => {
      const [authorization, cpf] = ["Auth token", "000.000.000-00"];
      const error = new Error("unexpected error");

      const requestSpy = jest.spyOn(HttpClient, "request");
      requestSpy.mockRejectedValueOnce(error);

      const promise = service.findNBs({ authorization, cpf });
      await expect(promise).rejects.toThrow(error);
    });
  });
});
