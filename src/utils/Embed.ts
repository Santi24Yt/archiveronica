import type {
  APIEmbed,
  APIEmbedAuthor,
  APIEmbedField,
  APIEmbedFooter,
  APIEmbedImage,
  APIEmbedProvider,
  APIEmbedThumbnail,
  APIEmbedVideo,
} from "discord-api-types/v10";

class Embed implements APIEmbed {
  public url?: string;
  public timestamp?: string;
  public color?: number;
  public footer?: APIEmbedFooter;
  public image?: APIEmbedImage;
  public thumbnail?: APIEmbedThumbnail;
  public video?: APIEmbedVideo;
  public provider?: APIEmbedProvider;
  public author?: APIEmbedAuthor;
  public fields?: APIEmbedField[];

  public setImage(url: string): this {
    this.image = {
      url,
    };
    return this;
  }

  public setThumbnail(url: string): this {
    this.thumbnail = {
      url,
    };
    return this;
  }

  public toJSON(): APIEmbed {
    const embed: APIEmbed = {};
    if (this.image !== undefined) {
      embed.image = this.image;
    }
    if (this.thumbnail !== undefined) {
      embed.thumbnail = this.thumbnail;
    }

    return embed;
  }
}

export default Embed;
