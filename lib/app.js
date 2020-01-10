const express = require('express');
const app = express();
const cors = require('cors');
const mongoConnection = require('./middleware/mongo-connection');

app.use(cors());

app.use(require('morgan')('tiny', {
  // skip: () => process.env.NODE_ENV = 'test'
}));

app.use(express.json());

app.use('/api/v1/jobs', mongoConnection, require('./routes/jobs'));
app.use('/api/v1/companies', mongoConnection, require('./routes/companies'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
