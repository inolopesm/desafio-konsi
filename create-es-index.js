/* eslint-disable @typescript-eslint/no-var-requires */
/** Create elastic search index if not exists */

const { Client } = require("@elastic/elasticsearch");
const { errors } = require("@elastic/transport");
const { ConnectionError } = errors;

const MAX_TRIES = 12;
const MS_TO_RETRY = 5000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const log = (msg, type = "log") =>
  console[type](
    `[Script] ${process.pid} - ${new Date().toISOString()} - ${msg}`
  );

async function createESIndexIfNotExists() {
  for (let i = 0; i < MAX_TRIES; i++) {
    try {
      const client = new Client({ node: process.env.ELASTICSEARCH_URL });

      const exists = await client.indices.exists({ index: "konsi" });

      if (exists) {
        log("elasticsearch index already exists");
        return;
      }

      const response = await client.indices.create({ index: "konsi" });

      log("elasticsearch index created");
      log(JSON.stringify(response));

      return;
    } catch (error) {
      if (error instanceof ConnectionError) {
        log(`retrying (${i + 1}/${MAX_TRIES}) in ${MS_TO_RETRY}ms...`);
        await sleep(MS_TO_RETRY);
      } else {
        throw error;
      }
    }
  }

  throw new Error(`max tries (${MAX_TRIES}) reached`);
}

createESIndexIfNotExists().catch((error) => {
  log(String(error), "error");
  process.exit(1);
});
