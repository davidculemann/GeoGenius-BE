import { Request, Response } from 'express';
import { getAuth as getClientAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { FirebaseError } from 'firebase-admin';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';

export default async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    try {
        const credential = await signInWithEmailAndPassword(getClientAuth(), email, password);
        const token = await getAdminAuth().createCustomToken(credential.user.uid);
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
