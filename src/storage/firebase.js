
const firebase = require('firebase/app');
const firebaseConfig = {
    apiKey: process.env.GPT2_FIREBASE_API_KEY,
    authDomain: process.env.GPT2_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.GPT2_FIREBASE_DATABASE_URL,
    projectId: process.env.GPT2_FIREBASE_PROJECT_ID,
    storageBucket: process.env.GPT2_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.GPT2_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.GPT2_FIREBASE_APP_ID,
    measurementId: process.env.GPT2_FIREBASE_MEASUREMENT_ID,
};

class FirebaseManager {
    #firebase;

    constructor(name) { // name - 'GPT2Firebase'
        if (!firebase.apps.find(el => el.name_ === name)) {
            this.#firebase = firebase
        }
        
    }

    uploadFile(data) {

        const ref = this.#firebase.storage().ref(``);
    }

    downloadFile(data) {

    }

}