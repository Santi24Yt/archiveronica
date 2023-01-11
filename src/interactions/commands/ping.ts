import type Command from "../Command";

const ping: Command = {
  json: {
    name: "ping",
    description: "pong",
    type: 1,
  },
  exec: (ctx) => {
    ctx.reply("pong");
  },
};

export default ping;
