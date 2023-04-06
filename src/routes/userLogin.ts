//NOTE: this functionality doesn't work on firebase-admin yet, should be done from the client side
import { Request, Response } from 'express';
import { getAuth as getClientAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { FirebaseError } from 'firebase-admin';
import firebaseAdmin from '../firebaseAdmin';

export default async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
        const credential = await signInWithEmailAndPassword(getClientAuth(), email, password);
        const adminAuth = firebaseAdmin.auth();
        const token = await adminAuth.createCustomToken(credential.user.uid);
        res.status(200).json({ token });
    } catch (error: unknown) {
        const { code } = error as FirebaseError;
        if (code === 'auth/wrong-password' || code === 'auth/user-not-found') {
            res.status(403);
        } else {
            res.status(500);
        }
        res.json({
            error: { code: code.replace('auth/', '') }
        });
    }
}
