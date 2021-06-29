
const firebase = require('firebase/app');
const { times } = require('lodash');
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
            this.#firebase = firebase.initializeApp(firebaseConfig, name);
            console.log('{name}-Firebase initialized.');
        } else {
            this.#firebase = firebase.app(name);
        }
    }

    // To Do
        // Feature #1. Follow uploading progress 
        // Feature #2. Proceed tasks after upload is done using 'promise chain'
    uploadFile(data, progressEvent, successiveTask) {

        const address = data.address;
        const textFile = data.textFile;
        const trainId = data.trainId;
        const fileName = textFile.name;
        const privateKey = data.privateKey;

        const modelType = data.modelType;
        const ainizeUid = data.ainizeUid;
        const ainizeMail = data.ainizeMail;
        const epochs = data.epochs;

        const ref = this.#firebase.storage().ref(`trainData/${address}/${trainId}/${fileName}`);
        const uploadTask = ref.put(textFile);

        // Feature #1.
        uploadTask.on('state_changed', (snapshot) => {
            let progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            dispatch ({
                /* // from Legacy code
                type: SET_PROGRESS, // defined in redux/actions
                */
                type: progressEvent,
                data: {
                    progress
                }
            })
        });
        
        // Feature #2.
        try {
            /* // from Legacy code.
            return await uploadTask.then(async (snapshot) => {
                const timestamp = Date.now();
                const txBody = buildTrainRequestTxBody(address, trainId, fileName, timestamp, modelType, ainizeUid, ainizeMail, epochs);
                const {signedTx} = signTx(txBody, privateKey);
                const {result, ...rest} = await this.#firebase.functions()
                                        .httpsCallable('sendSignedTransaction')(signedTx);
            });
            */
            return await uploadTask.then(successiveTask);
        } catch (e) {
            console.error(e);
        }
    }

    downloadFile(data) {

    }

}