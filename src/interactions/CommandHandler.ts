import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import type { APIApplicationCommandInteraction } from "discord-api-types/v10";

import type Command from "./Command.js";

import list from "./commands/list.js";
import CommandInteraction from "./CommandInteraction.js";

class CommandHandler {
  private readonly commands: Command[];

  public constructor() {
    this.commands = list;
  }

  public run(req: ExpressRequest, res: ExpressResponse): unknown {
    const command = this.findCommand(
      req.body as APIApplicationCommandInteraction
    );
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

  public findCommand(
    cmd: APIApplicationCommandInteraction
  ): Command | undefined {
    return this.commands.find(
      (command) =>
        command.json.name === cmd.data.name &&
        command.json.type === cmd.data.type
    );
  }
}

export default CommandHandler;
