import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import Interaction from "./Interaction";

class CommandInteraction extends Interaction {
  public constructor(req: ExpressRequest, res: ExpressResponse) {
    super(req, res);
  }
}

export default CommandInteraction;
