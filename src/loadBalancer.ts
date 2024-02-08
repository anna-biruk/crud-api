import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import os from 'os';

const runLoadBalancer = () => {
  const port = Number.parseInt(process.env.PORT || '3000');

  const targetUrls: string[] = [];
  for (let i = 0; i < os.cpus().length - 1; i++) {
    targetUrls.push(`http://localhost:${port + i}`);
  }
  let currentIndex = 0; // To keep track of the current URL index

  const app = express();
  const loadBalancerPort = process.env.LOAD_BALANCER_PORT || 4000; // The port your load balancer listens on

  const chooseTarget = () => {
    const targetUrl = targetUrls[currentIndex];
    currentIndex = (currentIndex + 1) % targetUrls.length;
    return targetUrl;
  };
  app.use(bodyParser.json());
  app.use(express.json()); // For parsing application/json
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms'),
  );

  // Proxy request to the target URL
  app.use('*', (req, res, next) => {
    const target = chooseTarget();
    console.log({ target, body: req.body });
    return proxy(target, {
      proxyReqPathResolver: (req) => {
        return req.originalUrl;
      },
    })(req, res, next);
  });

  app.listen(loadBalancerPort, () => {
    console.log(
      `Proxy load balancer listening at http://localhost:${loadBalancerPort}`,
    );
  });
};
runLoadBalancer();
