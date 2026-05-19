import "dotenv/config";

import {
  REST,
  Routes
} from "discord.js";

import {
  slashData,
  contextData
} from "./commands/escalate";

const rest = new REST({ version: "10" })
  .setToken(process.env.TOKEN!);

async function main() {

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID!,
      process.env.GUILD_ID!
    ),
    {
      body: [
        slashData.toJSON(),
        contextData.toJSON()
      ]
    }
  );

  console.log("Commands deployed.");
}

main();
