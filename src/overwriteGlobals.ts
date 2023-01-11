/* eslint-disable import/no-unused-modules */
import { isDeepStrictEqual } from "node:util";
import type { APIApplicationCommand } from "discord-api-types/v10";
import commandList from "./interactions/commands/list";
import type Command from "./interactions/Command";

if (process.env.APP_ID === undefined || process.env.APP_ID === "") {
  throw new Error("No app id provided");
}
if (
  process.env.DISCORD_TOKEN === undefined ||
  process.env.DISCORD_TOKEN === ""
) {
  throw new Error("No discord token provided");
}

const commands: Command[] = commandList;

function findCommand(cmd: APIApplicationCommand): Command | undefined {
  return commands.find(
    (command) =>
      command.json.name === cmd.name && command.json.type === cmd.type
  );
}

fetch(
  "https://discord.com/api/v10/" +
    `/applications/${process.env.APP_ID}/commands?with_localizations=true`,
  {
    method: "GET",
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: process.env.DISCORD_TOKEN,
    },
  }
)
  .then(async (response) => {
    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`${response.status} ${responseText}`);
    }
    const discordCommands = (await response.json()) as APIApplicationCommand[];
    for (const discordCommand of discordCommands) {
      const command = findCommand(discordCommand);
      if (command === undefined) {
        throw new Error(
          `Unknown command fetched from discord\n${JSON.stringify(
            discordCommand,
            // eslint-disable-next-line unicorn/no-null
            null,
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            2
          )}`
        );
      }
      if (isDeepStrictEqual(command.json, discordCommand)) {
        commands.splice(commands.indexOf(command), 1);
      }
    }
    return response;
  })
  .catch(() => {
    console.error("Unexpected error fetching commands");
  });

fetch(
  "https://discord.com/api/v10/" +
    `/applications/${process.env.APP_ID}/commands?with_localizations=true`,
  {
    method: "PUT",
    body: JSON.stringify(commands),
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: process.env.DISCORD_TOKEN,
    },
  }
)
  .then(async (response) => {
    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`${response.status} ${responseText}`);
    }
    return response;
  })
  .catch(() => {
    console.error("Unexpected error uploading commands");
  });

console.log("Commands overwritten successfully");
