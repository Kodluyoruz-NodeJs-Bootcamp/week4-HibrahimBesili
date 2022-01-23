import { Router, Response, Request } from "express";
import jwt from "jsonwebtoken";
import HttpStatusCodes from "http-status-codes";

import User from "../../models/User";
import config from '../../../config.json';
import { JwtPayload } from '../../types/User';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const browser = req.headers["user-agent"];
  const token = req.headers.authorization as string;

  if(token) {
    try {
      const decoded = await jwt.verify(token, config.jwtSecret) as JwtPayload;;
      if(decoded.browser !== browser){
        return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
      }
      const users = await User.find({});
      return res.status(HttpStatusCodes.OK).json(users)
    } catch {
      return res.status(HttpStatusCodes.FORBIDDEN).json({ error: 'No credentials sent!' });
    }
  } else {
    res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
  }
})

export default router;