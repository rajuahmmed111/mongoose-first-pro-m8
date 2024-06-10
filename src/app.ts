import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalMiddleware from './app/Middleware/globalMiddleware';
import notFound from './app/Middleware/notFound';
import router from './app/routes';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

const test = async (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
  // Promise.reject();
};
app.get('/', test);

app.use('/api/v1', router);

// console.log(process.cwd());
// C:\projects\Mongoose\mongoose-first-pro-m8/.env

app.use(globalMiddleware);
app.use(notFound); // route not found

export default app;
