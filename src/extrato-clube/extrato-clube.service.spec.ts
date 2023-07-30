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
    it("should make a request to login route in external api", async () => {
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
    it.todo("should make a request to listagem route in external api");
    it.todo("should return an error if no nb was found");
    it.todo("should return nbs when success");
    it.todo("should return the error if instanceof HttpClientError");
    it.todo("should throw error in others cases");
  });
});
