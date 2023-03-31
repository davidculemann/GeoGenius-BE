import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import filePath from './utils/filePath';
import { Configuration, OpenAIApi } from 'openai';
import {
    CompletionRequestBody
    //CompletionEditRequestBody
} from './utils/types';
import {
    createCompletionRequestBody
    //createCompletionEditRequestBody
} from './utils/createCompletionRequestBody';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(morgan('combined'));
app.use(cors());
dotenv.config();
const PORT_NUMBER = process.env.PORT ?? 4000;
const GPT3_API_KEY = process.env.GPT3_API_KEY;
const MODEL = 'text-davinci-003';

const configuration = new Configuration({
    apiKey: GPT3_API_KEY
});
const openai = new OpenAIApi(configuration);

// API info page
app.get('/', (req, res) => {
    const pathToFile = filePath('../public/index.html');
    res.sendFile(pathToFile);
});

app.get('/example', (req, res) => {
    res.status(200).json('Hello World!');
});

app.get<{ id: string }>('/example/:id', (req, res) => {
    if (req.params.id !== '1') {
        res.status(404).json('not found');
    } else {
        res.status(200).json('found');
    }
});

/**
 * @route POST /completion
 * @bodyparam {string} prompt.required - The prompt for the language model to complete.
 * @returns {CompletionRequestBody} - The response from the OpenAI API's `createCompletion` function.
 * @throws {Error} - If there is an error making the API call.
 */
app.post<{}, {}, CompletionRequestBody>('/completion', async (req, res) => {
    const { prompt } = req.body;
    const completionReq = createCompletionRequestBody(prompt, MODEL);
    //console.log('POST /completion, prompt:', prompt);
    try {
        const response = await openai.createCompletion(completionReq);
        res.json(response.data);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unexpected error' });
        }
    }
});

/**
 * @route GET /models
 * @returns {object} - The response from the OpenAI API's `listEngines` function.
 * @throws {Error} - If there is an error making the API call.
 */
app.get('/models', async (req, res) => {
    try {
        const response = await openai.listEngines();
        res.json(response.data);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Unexpected error' });
        }
    }
});

// app.patch<{}, {}, CompletionEditRequestBody>(
//     '/completion/:promptId/edit',
//     async (req, res) => {
//         const { promptId } = req.params;
//         const { newPrompt } = req.body;
//         const completionReq = createCompletionEditRequestBody(
//             promptId,
//             newPrompt,
//             MODEL
//         );
//         try {
//             const response = await openai.updateCompletion(completionReq);
//             res.json(response.data);
//         } catch (error) {
//             if (error instanceof Error) {
//                 res.status(500).json({ error: error.message });
//             } else {
//                 res.status(500).json({ error: 'Unexpected error' });
//             }
//         }
//     }
// );

app.listen(PORT_NUMBER, () => {
    console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
