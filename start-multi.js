const cluster = require('cluster');
const os = require('os');
const http = require('http');
require('dotenv').config();

const PORT = process.env.PORTS;

if (cluster.isMaster) {
  const numWorkers = os.cpus().length - 1;

  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  let nextWorker = 0;

  const server = http.createServer((req, res) => {
    const worker = Object.values(cluster.workers)[nextWorker];
    worker.send('request', req, res);

    nextWorker = (nextWorker + 1) % numWorkers;
  });

  server.listen(PORT, () => {
    console.log(`Load balancer listening on port ${PORT}`);
  });
} else {
  // Worker processes
  const server = require('./server'); 
  const workerPort = PORT + cluster.worker.id;

  server.listen(workerPort, () => {
    console.log(`Worker ${process.pid} listening on port ${workerPort}`);
  });
}
