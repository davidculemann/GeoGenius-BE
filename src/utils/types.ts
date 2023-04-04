export interface DefaultCompletionRequestObject {
    max_tokens: number;
    temperature: number;
    top_p: number;
    n: number;
    stream: boolean | null;
    logprobs: number | null | undefined;
    //stop: string | Array<string>;
}

export interface CompletionRequestObject extends DefaultCompletionRequestObject {
    prompt: string;
    model: string;
}

export interface CompletionRequestBody {
    prompt: string;
}
export interface CompletionEditRequestBody {
    promptId: string;
    prompt: string;
    model: string;
}

export interface RequestWithToken extends Request {
    token: {
        uid: string;
    };
}
