import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { random, passAuthentication } from '../helpers/index';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // check is there user with that email
    const existingUser = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    if (!existingUser) {
      return res.status(400).json({
        message: `There is no user with ${ email } email`
      })
    }

    // authenticate user without knowing their password
    const expectedHash = passAuthentication(existingUser.authentication.salt, password);
    if(existingUser.authentication.password !== expectedHash.toString()){
      return res.status(403).json({
        message: "Wrong password"
      });
    }

    const salt = random();
    existingUser.authentication.sessionToken = passAuthentication(salt, existingUser._id.toString()).toString();

    await existingUser.save();

    // set cookie
    res.cookie('NADIA-AUTH', existingUser.authentication.sessionToken, { domain: 'localhost', path: '/' })

    return res.status(200).json({
      message: "Success login",
      data: existingUser
    }).end();

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        message: "Email, password, and username are required"
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
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
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}