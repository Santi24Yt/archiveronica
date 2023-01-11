import type { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import type CommandInteraction from "./CommandInteraction";

export default interface Command {
  json: RESTPostAPIApplicationCommandsJSONBody;
  exec: (ctx: CommandInteraction) => unknown;
}
