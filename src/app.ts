import cors from 'cors';
import express, { Application, Request, Response } from 'express';
const app: Application = express();
// const port = 3000

// parsers
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  const a = 10;

  res.send(a);
});

// console.log(process.cwd());
// C:\projects\Mongoose\mongoose-first-pro-m8/.env

export default app;
