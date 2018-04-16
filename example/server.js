const express = require('express');
const parser = require('body-parser');
const admyn = require('../server');
const app = express();

app.use(parser.json({ limit: '5mb' }));
app.use(parser.urlencoded({ extended: true, limit: '5mb' }));

app.use(
  '/admyn',
  async function(req, res, next) {
    req.admyn = {
      database: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'xyfir_accounts',
        connectionLimit: 100,
        waitForConnections: true,
        dateStrings: true
      }
    };
    next();
  },
  admyn()
);

app.use('/static', express.static(__dirname + '/static'));
app.get('/', (req, res) => res.sendFile(__dirname + '/client.html'));

app.listen(2063, () => console.log('~~Server running'));
