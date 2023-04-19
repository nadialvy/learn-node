import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response,next: express.NextFunction) => {
  try{
    const { id } = req.params;
    const currentUser = get(req, 'identity._id') as string;

    if(!currentUser){
      return res.status(403).json({
        message: "Forbidden, please login first"
      })
    }

    if(currentUser.toString() !== id){
      return res.status(403).json({
        message: "You are not allowed"
      });
    }

    return next();

  } catch (error){
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

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

    merge(req, { identity: await existingUser });

    return next();

  } catch (error){
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}