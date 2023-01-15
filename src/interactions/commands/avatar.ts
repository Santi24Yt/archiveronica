import type { APIApplicationCommandInteractionDataBasicOption } from "discord-api-types/v10";
import Embed from "../../utils/Embed.js";
import { getUser } from "../../utils/users.js";
import type Command from "../Command.js";

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
      {
        type: 4,
        name: "id",
        description: "The id of the user, it can be any user",
      },
    ],
  },
  // eslint-disable-next-line max-len
  // eslint-disable-next-line sonarjs/cognitive-complexity, complexity, max-statements
  exec: async (ctx) => {
    const embed = new Embed();
    let avatarUrl =
      "https://cdn.discordapp.com/attachments/510634721974419459/1064040437532348476/noavatar.gif";

    if (ctx.data.options === undefined || ctx.data.options.length === 0) {
      if (ctx.member !== undefined) {
        avatarUrl =
          ctx.member.user.avatar === null
            ? "https://cdn.discordapp.com/attachments/510634721974419459/1064040437532348476/noavatar.gif"
            : `https://cdn.discordapp.com/avatars/${ctx.member.user.id}/${ctx.member.user.avatar}.png`;
        embed.setImage(avatarUrl);
      } else if (ctx.user !== undefined) {
        avatarUrl =
          ctx.user.avatar === null
            ? "https://cdn.discordapp.com/attachments/510634721974419459/1064040437532348476/noavatar.gif"
            : `https://cdn.discordapp.com/avatars/${ctx.user.id}/${ctx.user.avatar}.png`;
        embed.setImage(avatarUrl);
      } else {
        ctx.textReply("No user found");
        return;
      }

      ctx.reply({
        content: `<${avatarUrl}>`,
        embeds: [embed.toJSON()],
      });
      return;
    }

    const idOption = ctx.findOption("id") as
      | APIApplicationCommandInteractionDataBasicOption
      | undefined;

    const userOption = ctx.findOption("user") as
      | APIApplicationCommandInteractionDataBasicOption
      | undefined;

    if (idOption !== undefined && userOption !== undefined) {
      ctx.textReply("No need to specify user and id, use only one");
      return;
    }

    if (idOption !== undefined) {
      const user = await getUser(idOption.value as string);
      if (user !== undefined) {
        avatarUrl =
          user.avatar === null
            ? "https://cdn.discordapp.com/attachments/510634721974419459/1064040437532348476/noavatar.gif"
            : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        embed.setImage(avatarUrl);
      } else {
        ctx.textReply("User not found");
        return;
      }
    }

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
      avatarUrl =
        user.avatar === null
          ? "https://cdn.discordapp.com/attachments/510634721974419459/1064040437532348476/noavatar.gif"
          : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
      embed.setImage(avatarUrl);
    }

    ctx.reply({
      content: `<${avatarUrl}>`,
      embeds: [embed.toJSON()],
    });
  },
};

export default avatar;
