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
                // Upload the data to Firebase as a collection
                const collectionName = file.replace('.csv', '');
                const collectionRef = admin.firestore().collection(collectionName);
                results.forEach((result) => {
                    collectionRef.add(result);
                });
            });
    });
});
