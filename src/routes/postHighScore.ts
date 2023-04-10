import admin from '../firebaseAdmin';
import { Request, Response } from 'express';

export default async function postHighScore(req: Request, res: Response) {
    const { mode, score, uid } = req.body;
    try {
        const docRef = admin.firestore().collection('users').doc(uid);
        const snapshot = await docRef.get();
        const data = snapshot.data();
        if (!data) {
            res.status(404).send('User not found.');
            return;
        }
        const { scores } = data;
        if (scores && scores[mode] > score) {
            res.status(200).send(scores);
            return;
        }
        const newScores = {
            ...scores,
            [mode]: score
        };
        await docRef.update({ scores: newScores });
        res.status(200).send(newScores);
    } catch (error) {
        console.error('Error posting score:', error);
        res.status(500).send('Error posting score.');
    }
}
