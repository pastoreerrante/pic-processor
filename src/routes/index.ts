import express from 'express';
import { Request, Response } from 'express';

const routes = express.Router();

routes.get('/', (req: Request, res: Response): void => {
  res.render('index', {
    message: `Welcome to pic-processor!
      Usage: {server_address}/api/images?filename={photoname}&width={number}&height={number}`
  });
});

export default routes;
