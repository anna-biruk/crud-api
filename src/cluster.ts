import 'dotenv/config';
import cluster from 'cluster';
import os from 'os';
import runWorker from './server';

const numCPUs = os.cpus().length;
const port = Number.parseInt(process.env.PORT || '3000');

const run = async () => {
  if (cluster.isMaster) {
    console.log('Number of detected CPUs: ' + numCPUs);
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs - 1; i++) {
      const workerEnv = { PORT: (port + i).toString() };
      cluster.fork(workerEnv);
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    runWorker(port);
    console.log(`Worker ${process.pid} started`);
  }
};

run();
