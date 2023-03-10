import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import type {
  APIInteraction,
  Snowflake,
  LocaleString,
  APIInteractionGuildMember,
  APIUser,
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
} from "discord-api-types/v10";
import { InteractionType } from "discord-api-types/v10";

class Interaction {
  public raw: APIInteraction;
  public id: Snowflake;
  public applicationId: Snowflake;
  public type: InteractionType;
  public token: string;
  public version: number;
  public locale: LocaleString;
  public data: object;
  public guildId?: Snowflake;
  public channelId?: Snowflake;
  public member?: APIInteractionGuildMember;
  public user?: APIUser;
  public appPermissions?: string;
  public guildLocale?: LocaleString;

  protected req: ExpressRequest;
  protected res: ExpressResponse;

  protected replied: boolean;

  public constructor(req: ExpressRequest, res: ExpressResponse) {
    this.req = req;
    this.res = res;
    // eslint-disable-next-line @shopify/prefer-class-properties
    this.replied = false;

    const raw = req.body as APIInteraction;

    if (raw.type === InteractionType.Ping) {
      throw new Error("Invalid interaction");
    }

    this.raw = raw;

    this.id = raw.id;
    this.applicationId = raw.application_id;
    this.type = raw.type;
    this.token = raw.token;
    this.version = raw.version;
    this.locale = raw.locale;
    this.data = raw.data;

    if (raw.guild_id !== undefined) {
      this.guildId = raw.guild_id;
    }
    if (raw.channel_id !== undefined) {
      this.channelId = raw.channel_id;
    }
    if (raw.member !== undefined) {
      this.member = raw.member;
    }
    if (raw.user !== undefined) {
      this.user = raw.user;
    }
    if (raw.app_permissions !== undefined) {
      this.appPermissions = raw.app_permissions;
    }
    if (raw.guild_locale !== undefined) {
      this.guildLocale = raw.guild_locale;
    }
  }

  public textReply(content: string, isEphemeral = false) {
    const response: APIInteractionResponse = {
      type: 4,
      data: {
        content,
      },
    };
    if (isEphemeral) {
      response.data = {
        ...response.data,
        // eslint-disable-next-line max-len
        // eslint-disable-next-line no-bitwise, @typescript-eslint/no-magic-numbers
        flags: 1 << 6,
      };
    }
    if (!this.replied) {
      this.resSend(response);
    }
  }

  public reply(data: APIInteractionResponseCallbackData) {
    const response: APIInteractionResponse = {
      type: 4,
      data,
    };
    if (!this.replied) {
      this.resSend(response);
    }
  }

  private resSend(res: APIInteractionResponse): void {
    this.res.send(res);
  }

  protected getData() {
    return this.data;
  }
}

export default Interaction;
