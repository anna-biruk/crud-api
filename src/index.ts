import 'dotenv/config';
import run from './server';
const port = Number.parseInt(process.env.PORT || '3000');
const app = run(port);

export default app;
