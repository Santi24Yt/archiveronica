import type Command from "../Command.js";
import avatar from "./avatar.js";
import ping from "./ping.js";
import ytdl from "./ytdl.js";

const commandList: Command[] = [ping, avatar, ytdl];

export default commandList;
