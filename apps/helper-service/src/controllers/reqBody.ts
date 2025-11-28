// Return body of request

import { Request, Response } from "express";

export const getReqBody = (req: Request, res: Response) => {
  res.json(req.body);
};
