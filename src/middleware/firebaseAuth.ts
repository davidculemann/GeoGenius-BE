import { NextFunction, Request, Response } from 'express';

import { getAuth } from 'firebase-admin/auth';

export default async function firebaseAuth(req: Request, res: Response, next: NextFunction) {
    const regex = /Bearer (.+)/i;
    try {
        const idToken = req.headers.authorization?.match(regex)?.[1];
        req.token = await getAuth().verifyIdToken(idToken as string);
        next();
    } catch (err) {
        res.status(401).json({ error: { code: 'unauthenticated' } });
    }
}
