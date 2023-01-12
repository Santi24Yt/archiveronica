import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import type { APIApplicationCommand } from "discord-api-types/v10";

import type Command from "./Command.js";

import list from "./commands/list.js";
import CommandInteraction from "./CommandInteraction.js";

class CommandHandler {
  // eslint-disable-next-line max-len
  // public static async fetchGlobalCommands(): Promise<APIApplicationCommand[]> {
  // if (process.env.APP_ID === undefined || process.env.APP_ID === "") {
  //     throw new Error("No app id provided");
  // }
  // if (
  //     process.env.DISCORD_TOKEN === undefined ||
  //     process.env.DISCORD_TOKEN === ""
  // ) {
  //     throw new Error("No discord token provided");
  // }
  // const response = await fetch(
  //     "https://discord.com/api/v10/" +
  // eslint-disable-next-line max-len
  //       `/applications/${process.env.APP_ID}/commands?with_localizations=true`,
  //     {
  //       method: "GET",
  //       headers: {
  //         // eslint-disable-next-line @typescript-eslint/naming-convention
  //         Authorization: process.env.DISCORD_TOKEN,
  //       },
  //     }
  // );
  // if (!response.ok) {
  //     const responseText = await response.text();
  //     throw new Error(`${response.status} ${responseText}`);
  // }
  // return (await response.json()) as APIApplicationCommand[];
  // }

  private readonly commands: Command[];

  public constructor() {
    this.commands = list;
  }

  public run(req: ExpressRequest, res: ExpressResponse): unknown {
    const command = this.findCommand(req.body as APIApplicationCommand);
    if (command === undefined) {
      res.send({
        type: 4,
        data: {
          content: "Missing command, contact devs",
          // eslint-disable-next-line max-len
          // eslint-disable-next-line no-bitwise, @typescript-eslint/no-magic-numbers
          flags: 1 << 6,
        },
      });
      console.error(
        `Missing command\n${JSON.stringify(
          req.body,
          // eslint-disable-next-line unicorn/no-null
          null,
          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          2
        )}`
      );
      return;
    }
    const ctx = new CommandInteraction(req, res);
    command.exec(ctx);
  }

  public findCommand(cmd: APIApplicationCommand): Command | undefined {
    return this.commands.find(
      (command) =>
        command.json.name === cmd.name && command.json.type === cmd.type
    );
  }
}

export default CommandHandler;
