import { DefaultCompletionRequestObject, CompletionRequestObject, CompletionEditRequestBody } from './types';

/**
 * An object containing default values for properties of a CompletionRequestObject.
 * @interface
 * @property {number} max_tokens - The maximum number of tokens to generate in the completion.
 * @property {number} temperature - Sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.
 * @property {number} top_p - The proportion of tokens to keep from the top-p filtered completions. Between 0 and 1.
 * @property {number} n - The number of completions to generate.
 * @property {boolean|null} stream - If set, will return a continuation token that can be used to stream the next batch of completions.
 * @property {number|null|undefined} logprobs - If set, will return the log probabilities of each token generated.
 * @property {string|Array<string>|null} stop - Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.
 */
const completionsConfigObject: DefaultCompletionRequestObject = {
    max_tokens: 256,
    temperature: 0,
    top_p: 1,
    n: 1,
    stream: false,
    logprobs: null
    // stop: "\n",
};

/**
 * Creates a new CompletionRequestObject with the provided prompt and model, and the default values from completionsConfigObject.
 * @function
 * @param {string} prompt - The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays.
 * @param {string} model - The model to use. e.g davinci, curie
 * @returns {CompletionRequestObject} - An object that contains the properties prompt, model, max_tokens, temperature, top_p, n, stream, logprobs and stop
 */
export const createCompletionRequestBody = (prompt: string, model: string): CompletionRequestObject => {
    return { prompt: prompt, model: model, ...completionsConfigObject };
};

/**
 * Creates the request body for updating a completion
 * @param {string} promptId - The id of the prompt that needs to be updated
 * @param {string} newPrompt - The new prompt you want to update the existing prompt with
 * @param {string} model - The model you want to use for the completion
 * @returns {Object} requestBody - An object containing the promptId, newPrompt, and model
 */
export const createCompletionEditRequestBody = (promptId: string, newPrompt: string, model: string): CompletionEditRequestBody => {
    const requestBody = {
        promptId: promptId,
        prompt: newPrompt,
        model: model
    };
    return requestBody;
};
