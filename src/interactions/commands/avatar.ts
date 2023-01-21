import type { APIApplicationCommandInteractionDataBasicOption } from "discord-api-types/v10";
import Embed from "../../utils/Embed.js";
import type Command from "../Command.js";

function getAvatarURL(id: string, hash: string, guildId?: string) {
  if (guildId === undefined) {
    return hash.startsWith("a_")
      ? `https://cdn.discordapp.com/avatars/${id}/${hash}.gif?size=1024`
      : `https://cdn.discordapp.com/avatars/${id}/${hash}.png?size=1024`;
  }
  return hash.startsWith("a_")
    ? `https://cdn.discordapp.com/guilds/${guildId}/users/${id}/avatars/${hash}.gif?size=1024`
    : `https://cdn.discordapp.com/guilds/${guildId}/users/${id}/avatars/${hash}.png?size=1024`;
}

const avatar: Command = {
  json: {
    name: "avatar",
    description: "Show the avatar of a user",
    type: 1,
    options: [
      {
        type: 6,
        name: "user",
        description: "No need to ping yourself",
      },
    ],
  },
  // eslint-disable-next-line max-len
  // eslint-disable-next-line sonarjs/cognitive-complexity, complexity, max-statements
  exec: (ctx) => {
    const embed = new Embed();

    if (ctx.data.options === undefined || ctx.data.options.length === 0) {
      if (
        ctx.member?.avatar !== undefined &&
        ctx.member.avatar !== null &&
        ctx.user?.avatar !== undefined &&
        ctx.user.avatar !== null
      ) {
        const guildAvatar = getAvatarURL(
          ctx.member.user.id,
          ctx.member.avatar,
          ctx.guildId
        );
        embed.setImage(guildAvatar);
        const userAvatar = getAvatarURL(ctx.user.id, ctx.user.avatar);
        embed.setThumbnail(userAvatar);
        ctx.reply({
          content: `\`guild\`: <${guildAvatar}>\n\`user\`: <${userAvatar}>`,
          embeds: [embed.toJSON()],

          // Add switch button
          components: [],
        });
        return;
      }
      let avatarUrl =
        "https://cdn.discordapp.com/attachments/510634721974419459/1064040437532348476/noavatar.gif";
      if (ctx.member?.avatar !== undefined && ctx.member.avatar !== null) {
        avatarUrl = getAvatarURL(
          ctx.member.user.id,
          ctx.member.avatar,
          ctx.guildId
        );
      }
      if (ctx.user?.avatar !== undefined && ctx.user.avatar !== null) {
        avatarUrl = getAvatarURL(ctx.user.id, ctx.user.avatar);
      }
      embed.setImage(avatarUrl);
      ctx.reply({
        content: `<${avatarUrl}>`,
        embeds: [embed.toJSON()],
      });
      return;
    }

    const userOption = ctx.findOption("user") as
      | APIApplicationCommandInteractionDataBasicOption
      | undefined;

    if (userOption !== undefined) {
      const userId = userOption.value as string;
      if (
        ctx.data.resolved === undefined ||
        ctx.data.resolved.users === undefined
      ) {
        ctx.textReply("Unexpected error", true);
        return;
      }
      const user = ctx.data.resolved.users[userId];
      const member = ctx.data.resolved.members?.[userId];
      if (
        member?.avatar !== undefined &&
        member.avatar !== null &&
        user.avatar !== null
      ) {
        const guildAvatar = getAvatarURL(user.id, member.avatar, ctx.guildId);
        embed.setImage(guildAvatar);
        const userAvatar = getAvatarURL(user.id, user.avatar);
        embed.setThumbnail(userAvatar);
        ctx.reply({
          content: `\`guild\`: <${guildAvatar}>\n\`user\`: <${userAvatar}>`,
          embeds: [embed.toJSON()],

          // Add switch button
          components: [],
        });
        return;
      }
      let avatarUrl =
        "https://cdn.discordapp.com/attachments/510634721974419459/1064040437532348476/noavatar.gif";
      if (member?.avatar !== undefined && member.avatar !== null) {
        avatarUrl = getAvatarURL(user.id, member.avatar, ctx.guildId);
      }
      if (user.avatar !== null) {
        avatarUrl = getAvatarURL(user.id, user.avatar);
      }
      embed.setImage(avatarUrl);
      ctx.reply({
        content: `<${avatarUrl}>`,
        embeds: [embed.toJSON()],
      });
    }
  },
};

export default avatar;
