import express from 'express';

import { getUsers,getUserById, deleteUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try{
    const users = await getUsers();
    return res.status(200).json(users);

  } catch (error){
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try{
    const _id = req.body;

    if(!_id){
      return res.status(400).json({
        message: "Id is required"
      });
    }

    const existingUser = await getUserById(_id);

    if(!existingUser){
      return res.status(400).json({
        message: "User not foud, try correcting id"
      });
    }

    const deleteUser = await deleteUserById(_id);
    const updatedUser = await getUsers();

    if(deleteUser){
      return res.status(200).json({
        message: "Success delete user",
        remainingUser: updatedUser
      })
    }

  } catch (error){
    console.log(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}