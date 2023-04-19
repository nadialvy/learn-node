import express from 'express';

import { getAllUsers } from '../controllers/user';

export default (router: express.Router) => {
  console.log('masuk router user');
  router.get('/users', getAllUsers);
}