const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const figlet = require('figlet');
const { connectToMongoDB } = require('./database/mongodb');

require('dotenv').config();
connectToMongoDB()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.static('public'));



process.on('uncaughtException', async (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err.stack}\n Exception origin: ${origin}`,
  );
  process.exit(1);
});
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});
app.use('/user', cors(), require('./user/routes/user.routes'));

const PORT =process.env.PORT;

const server = app.listen(PORT, () => {
  figlet('Baxture', async (err, data) => {
    if (err) {
      console.log('Somethig Went Wrong With figlet');
      console.dir(err);
      return;
    }
    console.log(data);
    console.log(`Worker ${process.pid} listening on port ${server.address().port}`);
  });
});
process.on('SIGINT', () => {
  console.log('SIGINT received');
  server.close(() => {
    console.log('User Server Closed..');
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  process.exit(0);
});
process.on('unhandledRejection', (err) => {
  console.log('Logged Error: ', err);
  server.close(() => process.exit(1));
});
module.exports = server;