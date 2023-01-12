import { json, Router } from "express";
import nacl from "tweetnacl";
import {
  InteractionType,
  InteractionResponseType,
} from "discord-api-types/v10";
import type { APIInteraction } from "discord-api-types/v10";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import CommandHandler from "./CommandHandler.js";

// eslint-disable-next-line new-cap
const router = Router();
const HTTP_BAD_REQUEST = 400;
const HTTP_OK = 200;
const { PUBLIC_KEY } = process.env;

const commandHandler = new CommandHandler();

if (PUBLIC_KEY === undefined || PUBLIC_KEY === "") {
  throw new Error("Invalid public key");
}

function handleInteraction(req: ExpressRequest, res: ExpressResponse): void {
  switch ((req.body as APIInteraction).type) {
    case InteractionType.Ping:
      res.status(HTTP_OK).send({
        type: InteractionResponseType.Pong,
      });
      break;

    // Slash commands, user context menu, message context menu
    case InteractionType.ApplicationCommand:
      commandHandler.run(req, res);
      break;

    case InteractionType.MessageComponent:
      break;

    case InteractionType.ApplicationCommandAutocomplete:
      break;

    case InteractionType.ModalSubmit:
      break;

    default:
      res.send("Unexpected interaction type");
  }
}

router.use(json());

router.post("/", (req, res) => {
  const signature = req.get("X-Signature-Ed25519");
  const timestamp = req.get("X-Signature-Timestamp");

  if (
    timestamp === "" ||
    signature === "" ||
    signature === undefined ||
    timestamp === undefined
  ) {
    return res.status(HTTP_BAD_REQUEST).end("Missing request signature");
  }

  const bodyString = JSON.stringify(req.body);

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + bodyString) as Uint8Array,
    Buffer.from(signature, "hex") as Uint8Array,
    Buffer.from(PUBLIC_KEY, "hex") as Uint8Array
  );

  if (!isVerified) {
    return res.status(HTTP_BAD_REQUEST).end("Bad request signature");
  }

  handleInteraction(req, res);

  // Return consistency (eslint)
  return "done";
});

export default router;
