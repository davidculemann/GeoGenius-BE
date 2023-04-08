import admin from '../firebaseAdmin';
import { Request, Response } from 'express';

export default async function getStatistics(req: Request, res: Response) {
    try {
        const statistic = req.params.statistic;
        const collectionRef = admin.firestore().collection(statistic);
        const snapshot = await collectionRef.get();
        const data = snapshot.docs.map((doc) => doc.data());
        res.json(data);
    } catch (error) {
        console.error('Error retrieving statistics:', error);
        res.status(500).send('Error retrieving statistics.');
    }
}
