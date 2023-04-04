// eslint-disable-next-line @typescript-eslint/no-var-requires
const firestore = require('firebase-admin').firestore();

import { Request, Response } from 'express';

export default async function getUser(req: Request, res: Response) {
    const userId = req.params.id;
    if (!userId) {
        res.status(400).json({ error: { code: 'no-user-id' } });
        return;
    }

    if (userId !== req.token.uid) {
        res.status(403).json({ error: { code: 'unauthorized' } });
    }

    const snapshot = await firestore.collection('users').doc(userId).get();
    if (!snapshot.exists) {
        res.status(404).json({ error: { code: 'user-not-found' } });
        return;
    }
    const user = snapshot.data();

    res.status(200).json({ username: user.username });
}
