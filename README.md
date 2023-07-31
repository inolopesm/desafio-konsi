# Desafio Software Engineer - Backend

Este repositório é referente ao desafio técnico da [Konsi](https://www.konsi.com.br/), contendo uma aplicação web utilizando como base o framework [NestJS](https://nestjs.com/), tendo suporte de outras ferramentas sendo: [RabbitMQ](https://www.rabbitmq.com/), ~~[Puppeteer](https://pptr.dev/)~~, [Redis](https://redis.io/) e o [ElasticSearch](https://www.elastic.co/)

> [🔗 Acesse o desafio para entender mais sobre o projeto](https://gist.github.com/gustavoaraujofe/265c43b8b1df2dc4d6dd7e28959371d4)


## Requisitos

- Node.js v18.17.0
- RabbitMQ v3.12.2
- Redis v7.0.12
- ElasticSearch v8.8.1

ou

- Docker v24.0.4

## Instalação

- Clone o repositório
- Instale as dependências: `npm install`
- Crie o arquivo `.env` e configure com base no `.env.example`
- Inicie a aplicação: `npm run start`

ou

- Clone o repositório
- Levante a aplicação via docker: `docker compose up`

## Para desenvolvimento

### Visual Studio Code

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

### Instalação
- Clone o repositório
- Crie o arquivo `.env` e configure com base no `.env.example`
- Inicie as dependências externas via docker:
  - `docker compose up rabbitmq -d`
  - `docker compose up redis -d`
  - `docker compose up elasticsearch -d`
- Inicie a aplicação em modo de desenvolvimento: `npm run start:dev`

## Mais informações

### Rotas

- [Depreciada] ~~Buscar número do benefício via puppeteer: `POST /api/extrato-clube/v1/:cpf`~~
- Buscar números dos benefícios via api: `POST /api/extrato-clube/v2/:cpf`
- Exibir resultados das buscas via api: `GET /api/extrato-clube/v1/:cpf`
- Exibir resultados das buscas via página web `GET /extrato-clube`
