import admin from '../firebaseAdmin';
import { Request, Response } from 'express';

export default async function getLeaderboard(req: Request, res: Response) {
    const firestore = admin.firestore();
    const mode = req.params.mode; // Get the mode parameter from the request query, or default to null
    const scoreType = mode === 'timetrial' ? 'customScores' : 'scores';
    let usersRef = firestore.collection('users') as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;

    if (mode === 'timetrial') {
        usersRef = usersRef.where(`customScores`, '!=', null); // Filter users by presence of customScores property
    } else if (mode !== 'all') {
        usersRef = usersRef.where(`scores.${mode}`, '>', 0); // Filter users by mode if a mode parameter is provided
    }

    const snapshot = await usersRef.get();

    interface Scores {
        [userId: string]: {
            [mode: string]: number;
        };
    }

    const scores = {} as Scores;
    snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const userId = data.username;
        if (!scores[userId]) {
            scores[userId] = {};
        }
        if (data[scoreType])
            Object.keys(data[scoreType]).forEach((key) => {
                scores[userId][key] = data[scoreType][key];
            });
    });

    const leaderboard = Object.keys(scores).map((userId) => {
        const userScores = scores[userId];
        const modeScore = userScores[mode] || 0;
        const photoURL = `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${userId}`;
        if (mode === 'all' || mode === 'timetrial') {
            return Object.keys(userScores).map((mode) => {
                return {
                    username: userId,
                    userPhoto: photoURL,
                    score: userScores[mode],
                    mode: mode
                };
            });
        }
        return {
            username: userId,
            userPhoto: photoURL,
            score: modeScore,
            mode: mode
        };
    });
    const formattedLeaderboard = leaderboard.flat().sort((a, b) => b.score - a.score);
    const top10 = formattedLeaderboard.slice(0, 10);

    res.status(200).send(top10);
}
