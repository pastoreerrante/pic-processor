import express from 'express';
import { Request, Response } from 'express';
import images from './api/images';

const routes = express.Router();

// if someone GET just /api endpoint (and not /api/images), she will see an help msg
routes.get('/', (req: Request, res: Response): void => {
  res.render('index', {
    message: `Welcome to pic-processor!
      Usage: {server_address}/api/images?filename={photoname}&width={number}&height={number}`
  });
});

// this api is the core of the app
routes.use('/images', images);

export default routes;
