import { type NextFunction, type Request, type Response } from "express"

export const getHealth = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ ok: true })
}
