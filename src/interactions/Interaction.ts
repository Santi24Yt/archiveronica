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
} from "discord-api-types/v10";
import { InteractionType } from "discord-api-types/v10";

class Interaction {
  protected raw: APIInteraction;
  protected id: Snowflake;
  protected applicationId: Snowflake;
  protected type: InteractionType;
  protected token: string;
  protected version: number;
  protected locale: LocaleString;
  protected data: object;
  protected guildId?: Snowflake;
  protected channelId?: Snowflake;
  protected member?: APIInteractionGuildMember;
  protected user?: APIUser;
  protected appPermissions?: string;
  protected guildLocale?: LocaleString;

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

  public reply(content: string, isEphemeral = false) {
    const response: APIInteractionResponse = {
      type: 1,
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

  private resSend(res: APIInteractionResponse): void {
    this.res.send(res);
  }
}

export default Interaction;
