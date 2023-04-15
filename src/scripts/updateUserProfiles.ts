import admin from '../firebaseAdmin';

// Get a reference to the Firebase Auth service
const auth = admin.auth();

// Fetch all users
auth.listUsers()
    .then(({ users }) => {
        const promises: Promise<void>[] = [];

        // Loop through each user record
        for (const userRecord of users) {
            // Check if the user doesn't have a photo URL
            if (!userRecord.photoURL) {
                // Generate a unique avatar URL based on the user's email
                const avatarUrl = `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${userRecord.displayName}`;

                // Update the user's photo URL with the generated avatar URL
                const promise = auth
                    .updateUser(userRecord.uid, {
                        photoURL: avatarUrl
                    })
                    .then(() => {
                        console.log(`User ${userRecord.email} updated with photoURL: ${avatarUrl}`);
                    })
                    .catch((error) => {
                        console.error(`Error updating user ${userRecord.email}:`, error);
                    });
                promises.push(promise);
            }
        }

        // Wait for all updates to complete
        return Promise.all(promises);
    })
    .then(() => {
        console.log;
    })
    .catch((error) => console.error('Error listing users:', error));
