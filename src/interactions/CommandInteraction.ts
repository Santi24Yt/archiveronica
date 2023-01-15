import type {
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataOption,
} from "discord-api-types/v10";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import Interaction from "./Interaction.js";

class CommandInteraction extends Interaction {
  public data: APIChatInputApplicationCommandInteractionData;

  public constructor(req: ExpressRequest, res: ExpressResponse) {
    super(req, res);
    this.data = super.data as APIChatInputApplicationCommandInteractionData;
  }

  public findOption(
    opt: string
  ): APIApplicationCommandInteractionDataOption | undefined {
    if (this.data.options === undefined || this.data.options.length === 0) {
      return undefined;
    }
    return this.data.options.find((option) => option.name === opt);
  }
}

export default CommandInteraction;
