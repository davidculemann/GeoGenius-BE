import * as fs from 'fs';
import csvParser from 'csv-parser';
import admin from './firebaseAdmin';
import path from 'path';

// Define the path to the folder containing the CSV files
const folderPath = path.join(__dirname, 'data');

// Iterate through each file in the folder
fs.readdir(folderPath, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        // Parse the CSV file
        const results: Array<object> = [];
        fs.createReadStream(`${folderPath}/${file}`)
            .pipe(csvParser())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', () => {
                // Replace the data in Firebase as a collection
                const collectionName = file.replace('.csv', '');
                const collectionRef = admin.firestore().collection(collectionName);
                // Delete all documents in the collection
                collectionRef.get().then((snapshot) => {
                    const batch = admin.firestore().batch();
                    snapshot.forEach((doc) => {
                        batch.delete(doc.ref);
                    });
                    batch.commit().then(() => {
                        // Add the new data to the collection
                        results.forEach((result) => {
                            collectionRef.add(result);
                        });
                    });
                });
            });
    });
});
