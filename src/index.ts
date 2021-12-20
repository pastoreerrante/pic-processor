import * as path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import routes from './routes/index';

const app = express();
// http listening port
const port = 3000;
// path containing original photos. process.cwd() gives back
// the project root path
const fullPhotoPath = path.join(process.cwd(), 'asset', 'full');
// path containing resized photos
const thumbPhotoPath = path.join(process.cwd(), 'asset', 'thumb');

// use ejs to render html template
app.set('view engine', 'ejs');

// app home page
app.get('/', (req: Request, res: Response): void => {
  res.render('index', {
    message: `Welcome to pic-processor!
      Usage: {server_address}/api/images?filename={photoname}&width={number}&height={number}`
  });
});

// api live behind the api/ namespace
app.use('/api', routes);

app.listen(port, '0.0.0.0', () => {
  console.log(`server started at localhost:${port}`);
});

export { app as default, fullPhotoPath, thumbPhotoPath };
