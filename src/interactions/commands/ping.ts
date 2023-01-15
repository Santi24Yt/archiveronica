import type Command from "../Command.js";

const ping: Command = {
  json: {
    name: "ping",
    description: "pong",
    type: 1,
  },
  exec: (ctx) => {
    ctx.textReply("pong");
  },
};

export default ping;
