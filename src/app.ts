import cors from 'cors';
import express, { Application } from 'express';
import globalMiddleware from './app/Middleware/globalMiddleware';
import notFound from './app/Middleware/notFound';
import router from './app/routes';
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

app.use('/api/v1', router);

// console.log(process.cwd());
// C:\projects\Mongoose\mongoose-first-pro-m8/.env

app.use(globalMiddleware);
// route not found
app.use(notFound);

export default app;
