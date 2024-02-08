import express, { Express } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUser,
} from './api';
import { dataSource } from './db';

const morganMiddleware = morgan(function (tokens, req, res) {
  return [
    process.env.PORT,
    '|',
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms',
  ].join(' ');
});

const run = (port: number): Express => {
  const app = express();
  app.use(bodyParser.json());
  app.use(morganMiddleware);

  app.get('/api/users', getAllUsers);
  app.get('/api/users/:userId', getUserById);
  app.post('/api/users', createUser);
  app.put('/api/users/:userId', updateUser);
  app.delete('/api/users/:userId', deleteUserById);

  app.use((req, res, next) => {
    res
      .status(404)
      .send('404 Not Found - The requested resource does not exist.');

    res.on('finish', () => {
      if (res.statusCode === 500) {
        console.error('Internal Server Error:', res.statusMessage);
      }
    });
    next();
  });

  app.listen(port, async () => {
    await dataSource.initialize();
    console.log(`Server is listening at http://localhost:${port}`);
  });
  return app;
};

export default run;
