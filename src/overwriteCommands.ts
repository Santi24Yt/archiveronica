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
        "Content-Type": "application/json",
      },
    }
  );
  if (!overwrite.ok) {
    const responseText = await overwrite.text();
    throw new Error(`${overwrite.status} ${responseText}`);
  }
  const body = (await overwrite.json()) as object;
  console.log(body);
} catch (error) {
  console.error("Unexpected error uploading commands");
  console.error(error);
}
console.log("Commands overwritten successfully");
