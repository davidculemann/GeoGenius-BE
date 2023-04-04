declare namespace Express {
    interface Request {
        token: {
            uid: string;
        };
        headers: {
            authorization: string;
        };
    }
}
