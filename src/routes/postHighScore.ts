import admin from '../firebaseAdmin';
import { Request, Response } from 'express';

export default async function postHighScore(req: Request, res: Response) {
    const { mode, score, uid, customisation } = req.body;
    try {
        const docRef = admin.firestore().collection('users').doc(uid);
        const snapshot = await docRef.get();
        const data = snapshot.data();
        if (!data) {
            res.status(404).send('User not found.');
            return;
        }
        const scoreData = { scores: data.scores, customScores: data.customScores };
        const { scores, customScores } = data;
        const scoreToUpdate = customisation ? customScores : scores;
        if (scoreToUpdate && scoreToUpdate[mode] > score) {
            res.status(200).send(scoreData);
            return;
        }
        const newScores = {
            ...scoreToUpdate,
            [mode]: score
        };
        if (customisation) {
            await docRef.update({ customScores: newScores });
            res.status(200).send({ scores, customScores: newScores });
        } else {
            await docRef.update({ scores: newScores });
            res.status(200).send({ scores: newScores, customScores });
        }
    } catch (error) {
        console.error('Error posting score:', error);
        res.status(500).send('Error posting score.');
    }
}
