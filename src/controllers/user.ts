import express from 'express';

import { getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try{
    console.log('masuk controller');
    const users = await getUsers();
    console.log(users);

    return res.status(200).json(users);

  } catch (error){
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}