import express from 'express';
import admin, { ServiceAccount } from 'firebase-admin';
import completionRouter from './routes/completionRoutes';
import cors from 'cors';
import dotenv from 'dotenv';
import exampleRouter from './routes/exampleRoutes';
import filePath from './utils/filePath';
import morgan from 'morgan';

admin.initializeApp({
    credential: admin.credential.cert('./serviceAccount.json' as ServiceAccount)
});

import getUser from './routes/getUser';
import login from './routes/userLogin';
import register from './routes/userRegistration';
import firebaseAuth from './middleware/firebaseAuth';
import validateEmailAndPassword from './middleware/validateEmailAndPassword';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const functions = require('firebase-functions');

const app = express();

app.use(express.json());
app.use(morgan('combined'));
app.use(cors());
dotenv.config();

const PORT_NUMBER = process.env.SERVER_PORT ?? 4000;

// API info page
app.get('/', (req, res) => {
    const pathToFile = filePath('../public/index.html');
    res.sendFile(pathToFile);
});
app.use('/example', exampleRouter);
app.use('/completion', completionRouter);
app.get('/login', validateEmailAndPassword, login);
app.post('/register', validateEmailAndPassword, register);
app.get('/users/:id', firebaseAuth, getUser);

app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
});

exports.api = functions.https.onRequest(app);
