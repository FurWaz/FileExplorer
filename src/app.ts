import express from 'express';
import { Log, ErrLog } from './tools/log';

const auth = require('./middlewares/auth');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    process.env.NODE_ENV === 'development'
        ? console.log(`${req.method} ${req.url}`, { body: req.body })
        : console.log(`${req.method} ${req.url}`); // don't log the body in production to avoid leaking sensitive data
    next();
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    if (req.method === 'OPTIONS') res.sendStatus(200);
    else next();
});

app.use('', auth, require('./routes/explorer'));

export { app };
