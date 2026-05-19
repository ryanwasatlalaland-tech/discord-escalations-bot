import "dotenv/config";

import fs from "fs";
import path from "path";

import {
  Client,
  GatewayIntentBits
} from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const eventsPath =
  path.join(__dirname, "events");

const eventFiles =
  fs.readdirSync(eventsPath);

for (const file of eventFiles) {

  const event =
    require(path.join(eventsPath, file)).default;

  if (event.once) {
    client.once(event.name, (...args) =>
      event.execute(...args)
    );
  } else {
    client.on(event.name, (...args) =>
      event.execute(...args)
    );
  }
}

client.login(process.env.TOKEN);
