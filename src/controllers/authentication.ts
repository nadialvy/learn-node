import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { random, passAuthentication } from '../helpers/index';

export const register = async (req: express.Request, res: express.Response) => {
  try{
    const {email, password, username} = req.body;

    if(!email || !password || !username){
      return res.status(400).json({
        message: "Email, password, and username are required"
      });
    }

    const existingUser = await getUserByEmail(email);
    if(existingUser){
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const salt = random();
    const user = await createUser({
      username,
      email,
      authentication: {
        password: passAuthentication(salt, password),
        salt: salt
      }
    });

    return res.status(200).json(user).end();
  }catch (error){
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}