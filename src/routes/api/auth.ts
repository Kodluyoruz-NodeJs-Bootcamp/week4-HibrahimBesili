import bcrypt from "bcryptjs";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../../types/Payload";
import Request from "../../types/Request";
import User, { TUserModel } from "../../models/User";
import config from '../../../config.json';

const router: Router = Router();

router.post("/register", [
  check("username", "Please include a valid username").exists({checkFalsy: true}),
  check("password", "Password is required").exists({checkFalsy: true}),
  check("name", "Name is required").exists({checkFalsy: true}),
  check("lastname", "Lastname is required").exists({checkFalsy: true})
], async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }

  const {name, lastname, username, password} = req.body;

  const newUser = new User({
    name,
    lastname,
    username,
    password
  });

  try {
    let user: TUserModel = await User.findOne({ username: newUser.username });
    if (user) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: [
          {
            msg: "User already exists"
          }
        ]
      });
    }
    else {
      const hashed = await bcrypt.hash(newUser.password, 12);
      newUser.password = hashed;
      await newUser.save();
      res.status(HttpStatusCodes.OK).send();
    }
  }catch (error) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ auth: false, message: 'an error occured' });
  }
});

router.post(
  "/login",
  [
    check("username", "Please include a valid username").exists({checkFalsy: true}),
    check("password", "Password is required").exists({checkFalsy: true})
  ],
  async (req: Request, res: Response) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { name, surname, username, password } = req.body;
    try {

      let user: TUserModel = await User.findOne({ username: username }).exec();

      if (!user) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Invalid Credentials"
            }
          ]
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [
            {
              msg: "Invalid Credentials"
            }
          ]
        });
      }

      const payload: Payload = {
        userId: user.id,
        browser: req.headers["user-agent"]
      };

      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: config.jwtExpiration },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

export default router;
