import { json, Router } from "express";
import nacl from "tweetnacl";

// eslint-disable-next-line new-cap
const router = Router();
const HTTP_BAD_REQUEST = 400;
const { PUBLIC_KEY } = process.env;

if (PUBLIC_KEY === undefined || PUBLIC_KEY === "") {
  throw new Error("Invalid public key");
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
  // eslint-disable-next-line max-len
  //  eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + bodyString) as Uint8Array,
    Buffer.from(signature, "hex") as Uint8Array,
    Buffer.from(PUBLIC_KEY, "hex") as Uint8Array
  ) as boolean;

  if (!isVerified) {
    return res.status(HTTP_BAD_REQUEST).end("Bad request signature");
  }

  // Handle

  return "done";
});

export default router;
