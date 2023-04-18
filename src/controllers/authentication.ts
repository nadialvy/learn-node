import express from 'express';
import { getUserByEmail, createUser } from 'db/users';
import { random, passAuthentication } from 'helpers/index';

export const register = async (req: express.Request, res: express.Response) => {
  try{
    const {email, password, username} = req.body;

    if(!email || !password || !username){
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
    if(existingUser){
      return res.sendStatus(400)
    }

    const salt = random();
    const userPassword = passAuthentication(salt, password);
    const user = await createUser({
      username,
      email,
      authentication: {
        password: userPassword,
        salt: salt
      }
    });

    return res.status(200).json(user).end();
  }catch (error){
    console.log(error);
    return res.sendStatus(400);
  }
}