import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import filePath from './utils/filePath';
import morgan from 'morgan';
import exampleRouter from './routes/exampleRoutes';
import completionRouter from './routes/completionRoutes';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const functions = require('firebase-functions');

const app = express();

app.use(express.json());
app.use(morgan('combined'));
app.use(cors());
dotenv.config();

const PORT_NUMBER = 4000; //process.env.PORT ?? 4000;

// API info page
app.get('/', (req, res) => {
    const pathToFile = filePath('../public/index.html');
    res.sendFile(pathToFile);
});

app.use('/example', exampleRouter);
app.use('/completion', completionRouter);

app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
});

exports.api = functions.https.onRequest(app);
