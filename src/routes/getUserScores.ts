import firebaseAdmin from '../firebaseAdmin';
import { Request, Response } from 'express';

export default async function getUserScores(req: Request, res: Response) {
    const firestore = firebaseAdmin.firestore();
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
    if (!user) {
        res.status(500).json({ error: { code: 'internal-server-error' } });
        return;
    }
    res.status(200).json(user.scores);
}
