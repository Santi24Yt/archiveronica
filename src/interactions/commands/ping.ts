import type Command from "../Command.js";

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
