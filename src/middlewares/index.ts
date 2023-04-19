import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isAuthenticated = async (req: express.Request, res: express.Response,next: express.NextFunction) => {
  try{
    const sessionToken = req.cookies['NADIA-AUTH'];

    if(!sessionToken){
      return res.status(403).json({
        message: "Token is not detected"
      });
    }

    const existingUser = getUserBySessionToken(sessionToken);

    if(!existingUser){
      return res.status(403).json({
        message: "User not found"
      });
    }

    merge(req, { identity: existingUser });

    return next();

  } catch (error){
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}