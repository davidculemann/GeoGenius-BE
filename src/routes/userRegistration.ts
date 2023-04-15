import { Request, Response } from 'express';
import firebaseAdmin from '../firebaseAdmin';
import { FirebaseError } from 'firebase-admin';

const firestore = firebaseAdmin.firestore();

export default async function register(req: Request, res: Response) {
    const { email, password, username } = req.body;
    console.log('body in register', req.body);

    if (!username) {
        res.status(400).json({ error: { code: 'no-username' } });
        return;
    }

    try {
        const existingUser = await firestore.collection('users').where('username', '==', username).limit(1).get();
        if (!existingUser.empty) {
            res.status(400).json({ error: { code: 'username-already-in-use' } });
            return;
        }
        const credential: firebaseAdmin.auth.UserRecord = await firebaseAdmin.auth().createUser({ email, password });
        const token = await firebaseAdmin.auth().createCustomToken(credential.uid);
        const userAvatar = `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${username}`;
        await firebaseAdmin.auth().updateUser(credential.uid, { displayName: username, photoURL: userAvatar });
        await firestore.doc(`users/${credential.uid}`).set({ username });
        res.status(201).json({ token });
    } catch (err: unknown) {
        console.error('Error creating user:', err);
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
