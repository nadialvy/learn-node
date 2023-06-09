import express from 'express';

import { getUsers, getUserById, deleteUserById, updateUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    // check the id is exist or not
    const existingUser = getUserById(id);

    if (!id || !existingUser) {
      return res.status(400).json({
        message: "Try again, the id is not reachable"
      });
    }

    const deleteUser = await deleteUserById(id);

    if (deleteUser) {
      return res.status(200).json({
        message: "Success delete user",
        deletedUser: deleteUser,
      })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        message: "Username are required"
      });
    }

    const updateUser = await updateUserById(
      id,
      { username: username },
    );
    const updatedUser = await getUserById(id);

    if(updateUser){
      return res.status(200).json({
        message: "Success to update user",
        data: updatedUser,
      }).end();
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}