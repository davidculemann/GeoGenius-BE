import { NextFunction, Request, Response } from 'express';
import { isValidEmail } from '../utils/isEmail';

export default function validateEmailAndPassword(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    console.log('body', req.body);

    if (!email) {
        res.status(400).send({ error: { code: 'no-email' } });
        return;
    }

    if (!isValidEmail(email)) {
        res.status(400).send({ error: { code: 'invalid-email' } });
        return;
    }

    if (!password) {
        res.status(400).send({ error: { code: 'no-password' } });
        return;
    }

    next();
}
