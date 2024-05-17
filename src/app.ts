import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { StudentRoutes } from './app/Modules/student/student.router';
const app: Application = express();
// const port = 3000

// parsers
app.use(express.json());
app.use(cors());

// Application routes
app.use('/api/v1/students', StudentRoutes);

const getController = (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
};

app.get('/', getController);

// console.log(process.cwd());
// C:\projects\Mongoose\mongoose-first-pro-m8/.env

export default app;
