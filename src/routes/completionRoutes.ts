import express from 'express';
import { Configuration, OpenAIApi } from 'openai';
import { CompletionRequestBody } from '../utils/types';
import { createCompletionRequestBody } from '../utils/createCompletionRequestBody';

const completionRouter = express.Router();
const configuration = new Configuration({
    apiKey: process.env.GPT3_API_KEY || ''
});
const openai = new OpenAIApi(configuration);
const MODEL = 'text-davinci-003';

completionRouter.post<{}, {}, CompletionRequestBody>('/', async (req, res) => {
    const { prompt } = req.body;
    const completionReq = createCompletionRequestBody(prompt, MODEL);

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

completionRouter.get('/', async (req, res) => {
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

export default completionRouter;
