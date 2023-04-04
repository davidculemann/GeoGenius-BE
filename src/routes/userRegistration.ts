import { Request, Response } from 'express';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

import { FirebaseError } from 'firebase-admin';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const firestore = require('firebase-admin').firestore();

export default async function register(req: Request, res: Response) {
    const { email, password, username } = req.body;
    if (!username) {
        //handle errors here
        res.status(400).json({ error: { code: 'no-username' } });
        return;
    }

    try {
        const auth = getAuth();
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const adminAuth = getAdminAuth();
        const token = await adminAuth.createCustomToken(credential.user.uid);
        await firestore.doc(`users/${credential.user.uid}`).set({ username });
        res.status(201).json({ token });
    } catch (err: unknown) {
        const { code } = err as FirebaseError;
        if (code === 'auth/email-already-in-use') {
            res.status(400);
        } else {
            res.status(500);
        }
        res.json({
            error: {
                code: code ? code.replace('auth/', '') : undefined
            }
        });
    }
}
