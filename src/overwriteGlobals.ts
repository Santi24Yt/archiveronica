import { isDeepStrictEqual } from "node:util";
import type { APIApplicationCommand } from "discord-api-types/v10";
import { config } from "dotenv";
import commandList from "./interactions/commands/list.js";
import type Command from "./interactions/Command.js";

config();

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

await fetch(
  "https://discord.com/api/v10/" +
    `applications/${process.env.APP_ID}/commands?with_localizations=true`,
  {
    method: "GET",
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
  }
)
  // eslint-disable-next-line complexity, sonarjs/cognitive-complexity
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
    if (process.env.APP_ID === undefined || process.env.APP_ID === "") {
      throw new Error("No app id provided");
    }
    if (
      process.env.DISCORD_TOKEN === undefined ||
      process.env.DISCORD_TOKEN === ""
    ) {
      throw new Error("No discord token provided");
    }
    try {
      const overwrite = await fetch(
        "https://discord.com/api/v10/" +
          `applications/${process.env.APP_ID}/commands?with_localizations=true`,
        {
          method: "PUT",
          body: JSON.stringify(commands.map((cmd) => cmd.json)),
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
          },
        }
      );
      if (!overwrite.ok) {
        const responseText = await overwrite.text();
        throw new Error(`${overwrite.status} ${responseText}`);
      }
      console.log(overwrite.body);
    } catch (error) {
      console.error("Unexpected error uploading commands");
      console.error(error);
    }
    console.log("Commands overwritten successfully");
    return response;
  })
  .catch((error: unknown) => {
    console.error("Unexpected error fetching commands");
    console.error(error);
  });
