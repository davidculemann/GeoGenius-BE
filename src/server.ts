import express from 'express';
import completionRouter from './routes/completionRoutes';
import cors from 'cors';
import dotenv from 'dotenv';
import exampleRouter from './routes/exampleRoutes';
import filePath from './utils/filePath';
import morgan from 'morgan';
import getUser from './routes/getUser';
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

app.get('/', (req, res) => {
    const pathToFile = filePath('../public/index.html');
    res.sendFile(pathToFile);
});
app.use('/example', exampleRouter);
app.use('/completion', completionRouter);
app.post('/register', validateEmailAndPassword, register);
app.get('/users/:id', firebaseAuth, getUser);

app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
});

exports.api = functions.https.onRequest(app);
